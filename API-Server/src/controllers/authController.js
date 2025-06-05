import User from "../models/users.js";
import bcrypt from "bcryptjs";

import { registerSchema } from "../validations/authValid.js";
import generateTokenAndSetCookie from "../../utils/gennerateToken.js";
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "../../utils/logger.js"

export const register = async (req, res) => {
    logger.trace(
      {
        route: req.originalUrl,
        method: req.method,
        payload: req.body,
      },
      "Entered register()"
    );

    try {
      const { email, password } = req.body;
      logger.trace({ email }, "Validating registration payload");
      const { error } = registerSchema.validate(req.body);
      if (error) {
        logger.trace({tag : user-error, error, email},"Register error, wrong format.");
        logger.warn({tag : user-error, error, email},"Register error, wrong format.");
        return res.status(400).json({
          message: error.details[0].message,
          datas: [],
        });
      }
      const checkEmail = await User.findOne({ email });
      logger.trace({ email }, "Checking if email already exists");
      if (checkEmail) {
        logger.trace({ email }, "Email already in use");
        logger.warn({tag : user-error, email},"Register user error: email existed.");
        return res.status(400).json({
          message: " Email da ton tai!",
        });
      }
      logger.trace({ email }, "Hashing password");
      const hashNewPassword = await bcrypt.hash(password, 10);

      logger.trace({ email }, "Creating new user in DB");
      const user = await User.create({
        ...req.body,
        avatar: `${process.env.FQDN}/uploads/avatar/avatar.png`,
        password: hashNewPassword,
      });
      
      user.password = undefined;
      logger.trace(
            { userid: user._id, email: user.email },
            "User document created"
          );

      generateTokenAndSetCookie(user._id, res);
      logger.trace({ userid: user._id }, "Generating auth token and setting cookie");
      logger.info({userid: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin},"Sign up successfully.");
      return res.status(200).json({
        message: " Dang ky thanh cong ",
        datas: user,
      });
    } catch (error) {
        logger.trace(
        {
          errorMessage: error.message,
          stackSnippet: error.stack?.split("\n").slice(0, 2).join(" | "),
          payload: req.body,
        },
        "Exception in register()"
      );
      logger.error({
        error: error, email: req.body.email,
        },
        "Server error when user trying to create an account.")
      return res.status(500).json({
        message: "loi sever",
      });
    }
  };

  export const login = async (req, res) => {
      logger.trace(
      {
        route: req.originalUrl,
        method: req.method,
        payload: req.body,
      },
      "Entered login()"
    );
    try {
      const { email, password } = req.body;

      const checkEmail = await User.findOne({ email });
      logger.trace({ email }, "Looking up user by email for login");
      if (!checkEmail) {
        logger.trace({ email }, "Login attempt with non-existent email");
        logger.warn({tag : user-error, email},"user Login with nonexisted email.");
        return res.status(400).json({
          message: " Email khong dung!",
        });
      }
      const checkPassword = await bcrypt.compare(password, checkEmail.password);
      logger.trace({ email }, "Comparing provided password to stored hash");
      if (!checkPassword) {
        logger.warn({tag : user-error, email},"User gave wrong password for email.");
        logger.trace({ email }, "Password mismatch for user");
        return res.status(400).json({
          message: " Mat khau khong dung!",
        });
      }

      console.log("Generating token and setting cookie...");
      generateTokenAndSetCookie(checkEmail._id, res);
      logger.trace({ email, userid: checkEmail._id }, "Credentials verified, generating token");
      checkEmail.password = undefined;
      logger.info({email: req.body.email},"User signed in successfully.");
      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: checkEmail,
      });
    } catch (error) {
      logger.trace({
        error: error, email: req.body.email,
        },
        "Server error when user logging in account.")
      logger.error({
        error: error, email: req.body.email,
        },
        "Server error when user logging in account.")
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const logout = (req, res) => {
  try {
    logger.trace(
      {
        route: req.originalUrl,
        method: req.method,
        user: req.user?.email,
      },
      "Entered logout()"
    );
    
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("Cookie cleared");
    logger.trace({ user: req.user?.email }, "JWT cookie cleared");
    logger.info({email: req.body.email},"User logged out.");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.log(err);
    logger.trace({
        error: err, email: req.body.email,
        },
        "Server error when logging out account.")
    logger.error({
        error: err, email: req.body.email,
        },
        "Server error when logging out account.")
    return res.status(500).json({ error: err });
  }
};

export const allowAccess = async (req, res) => {
  logger.trace(
    {
      route: req.originalUrl,
      method: req.method,
      userProvided: Boolean(req.user),
      payload: req.body,
    },
    "Entered allowAccess()"
  );
  try {
    if (req.user) {
      logger.trace(
        { userId: req.user._id, email: req.body.email },
        "User present, granting access");
      logger.info({email : req.body.email},"Allow access for user.");
      return res.status(200).json({ message: "chap nhan truy cap" });
    }
    logger.trace({ email: req.body.email }, "No user, denying access");
    logger.warn({tag : user-error, email: req.body.email},"Access not allowed for user.");
    return res.status(403).json({ message: "Access not allowed for user!" });
  } catch (error) {
    logger.trace({error:error, user:req.user.name, email:req.user.email,}, "Server error with allowing access.")
    logger.error({error:error, user:req.user.name, email:req.user.email,}, "Server error with allowing access.")
    return res.status(500).json({ message: error.message });
  }
};
