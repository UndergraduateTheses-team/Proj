import User from "../models/users.js";
import Comment from "../models/comment.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "TIm thanh cong!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id:userId }).select("-password,-isAdmin,-favorite,-rating");
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
    console.error("Failed to retrieve user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("userId ? : " + userId);
    let userData = req.body.user ? JSON.parse(req.body.user) : {};

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const blob = new Blob([fileBuffer], { type: req.file.mimetype });
      const formData = new FormData();
      formData.append("file", blob, req.file.filename);

      const response = await fetch(`http://${process.env.SERVER_UPLOAD_URL}/uploads`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      userData.avatar = data;

      const existingUser = await User.findById(userId);
      if (existingUser && existingUser.avatar) {
        const oldFilePath = `/path/to/uploaded/files/${existingUser.avatar.filename}`; //thay the path -> __dirname , ../../../../ServerUpload/upload/ la ok? chua test
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

    if (!updatedUser) {
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }

    return res.status(200).json({
      message: "Cập nhật thành công người dùng",
      data: updatedUser,
    });
  } catch (error) {
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
    res.status(200).json({
      success: true,
      message: "User edited successfully",
    });
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await Comment.deleteMany({ userId: req.params.id });
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
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
          res.status(200).json({
            success: true,
            message: "Password reset successfully",
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Incorrect old password",
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
