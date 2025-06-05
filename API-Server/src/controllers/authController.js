import User from "../models/users.js";
import bcrypt from "bcryptjs";

import { registerSchema } from "../validations/authValid.js";
import generateTokenAndSetCookie from "../../utils/gennerateToken.js";
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "../../utils/logger.js"

export const register = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { error } = registerSchema.validate(req.body);
      if (error) {
        logger.warn({tag : user-error},"Register user error: "+ error);
        return res.status(400).json({
          message: error.details[0].message,
          datas: [],
        });
      }
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        logger.error("Register user error: email existed.");
        return res.status(400).json({
          message: " Email da ton tai!",
        });
      }

      const hashNewPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        ...req.body,
        avatar: `${process.env.FQDN}/uploads/avatar/avatar.png`,
        password: hashNewPassword,
      });
      user.password = undefined;

      generateTokenAndSetCookie(user._id, res);
      logger.info("Sign up successfully.");
      return res.status(200).json({
        message: " Dang ky thanh cong ",
        datas: user,
      });
    } catch (error) {
      logger.error({error}, "Server error when registing account.");
      return res.status(500).json({
        message: "loi sever",
      });
    }
  };

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkEmail = await User.findOne({ email });
      if (!checkEmail) {
        return res.status(400).json({
          message: " Email khong dung!",
        });
      }
      const checkPassword = await bcrypt.compare(password, checkEmail.password);
      if (!checkPassword) {
        return res.status(400).json({
          message: " Mat khau khong dung!",
        });
      }

      console.log("Generating token and setting cookie...");
      generateTokenAndSetCookie(checkEmail._id, res);
      checkEmail.password = undefined;

      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: checkEmail,
      });
    } catch (error) {
      logger.error({error}, "Server error when user logging in account.")
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("Cookie cleared");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.log(err);
    logger.error({error}, "Server error when logging out account.");
    return res.status(500).json({ error: err });
  }
};

export const allowAccess = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ message: "chap nhan truy cap" });
    }

    return res.status(403).json({ message: " Chua du tu cach dau!" });
  } catch (error) {
    logger.error({error}, "Server error with allowing access.")
    return res.status(500).json({ message: error.message });
  }
};
