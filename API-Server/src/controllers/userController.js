import User from "../models/users.js";
import Comment from "../models/comment.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import dotenv from 'dotenv';
import { logger } from "../../utils/logger.js"
dotenv.config();

export const getAllUsers = async (req, res) => {
  let users
  try {
    users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "TIm thanh cong!",
      data: users,
    });
  } catch (error) {
    logger.error({error, users}, "Server error getting all users")
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserDetail = async (req, res) => {
  let user
  try {
    const userId = req.user._id;
    // console.log("user:", req.user);
    user = await User.findOne({ _id:userId }).select("-password,-isAdmin,-favorite,-rating");
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
  } catch (error) {
    logger.error({error, user}, "Server error getting user detail")
    console.error("Failed to retrieve user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const updateUser = async (req, res) => {
  let userData
  try {
    const userId = req.user._id;
    userData = req.body.user ? JSON.parse(req.body.user) : {};

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const blob = new Blob([fileBuffer], { type: req.file.mimetype });
      const formData = new FormData();
      formData.append("file", blob, req.file.filename);
      
      
      const response = await fetch(`${process.env.FQDN_MEDIA_SERVER}/uploads/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      console.log("data:",data);
      userData.avatar = data;
      console.log("is the avatar link updated?:", userData.avatar);
      const existingUser = await User.findById(userId);
      if (existingUser && existingUser.avatar) {
        const oldFilePath = `/path/to/uploaded/files/${existingUser.avatar.filename}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      fs.unlinkSync(req.file.path);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });

console.log("updatedUser:", updatedUser);

if (!updatedUser) {
    logger.warn({userid:req.user._id, userData},"Failed to update user")
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }
    logger.info({userid:req.user._id, userdata},"update user.")
    return res.status(200).json({
      message: "Cập nhật thành công người dùng",
      data: updatedUser,
    });
  } catch (error) {
    logger.error({error, userData}, "Server error updating user")
    console.error("Lỗi khi cập nhật người dùng:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};


export const editUser = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.params.user_email },
      {
        name: req.body.name,
        avatar: req.body.avatar,
        isAdmin: req.body.isAdmin,
      }
    );
    logger.info({username: req.body.name, email:req.params.user_email},"Success editing user.")
    res.status(200).json({
      success: true,
      message: "User edited successfully",
    });
  } catch (error) {
    logger.error({error, email: req.params.user_email, name: req.body.name, isAdmin: req.body.isAdmin}, "Server error edit user")
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    const { deletedCount } = await User.deleteOne({ _id: req.params.id });
    if (deletedCount === 0) {
      logger.warn({userid: req.params.id},"User not found to be deleted")
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await Comment.deleteMany({ userId: req.params.id });
    logger.info({userid: req.params.id},"User deleted")
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error({error, userid: req.params.id}, "Server error deleting a user")
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;

const id = req.user._id;
  try {
    if (id) {
      const user = await User.findById(id);
      if (user) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (isMatch) {
          const salt = await bcrypt.genSalt(10);
          const hashNewPassword = await bcrypt.hash(newPassword, salt);
          await user.updateOne({ password: hashNewPassword });
          logger.info({userid: user._id, username: req.user.name},"Changed password successfully")
          res.status(200).json({
            success: true,
            message: "Password reset successfully",
          });
        } else {
          logger.warn({userid: user._id, username: req.user.name},"user Changed password failed due to incorrect old pass")
          res.status(400).json({
            success: false,
            message: "Incorrect old password",
          });
        }
      } else {
        logger.warn({userid: user._id, username: req.user.name},"user Changed password failed due to user not found.")
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } 
  } catch (error) {
    logger.error({error}, "Server error changing password")
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
