import Comment from "../models/comment.js";
import commentSchema from "../validations/commentValid.js";
import { logger } from "../../utils/logger.js"
export const getCommentByMovieId = async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.id })
      .populate({
        path: "userId",
        select: ["name", "email", "avatar"],
      })
      .sort({ createdAt: -1 });
    if (comments.length === 0) {
      return res.status(400).json({
        message: "Không tồn tại bình luận nào!",
      });
    }
    return res.status(200).json({
      message: "Tìm thành công bình luận",
      datas: comments,
    });
  } catch (error) {
    logger.error({error}, "Server error getting comments of movie")
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const getCountComments = async (req, res) => {
  try {
    const count = await Comment.countDocuments({ movieId: req.params.id });
    return res.status(200).json({
      message: "Đếm thành công số lượng bình luận",
      datas: count,
    });
  } catch (error) {
    logger.error({error},
      "Server error get count comments.")
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const postComment = async (req, res) => {
  try {
    const { movieId, commentContent } = req.body;

    const newComment = new Comment({
      userId: req.user._id,
      content: commentContent,
      movieId,
    });

    newComment.save();
    await newComment.populate({
      path: "userId",
      select: ["name", "email", "avatar"],
    });
    logger.info({username: req.user.name},"User posted a comment.")
    return res.status(200).json({
      message: "Bình luận thành công",
      datas: newComment,
    });
  } catch (error) {
    logger.error({
      error: error, username: req.user.name, email: req.user.email,
      },
      "Server error posting a comment.")
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) {
      logger.warn({error, username: req.user.name},"User gave format issue trying to update comment.")
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedComment) {
      logger.warn({error, username: req.user.name},"update comment failed to be updated on database.")
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }
    logger.info({username:req.user.name}, "Update comment.")
    return res.status(200).json({
      message: "Cập nhật thành công bình luận",
      datas: updatedComment,
    });
  } catch (error) {
    logger.error({
      error: error, username: req.user.name, email: req.user.email,
      },
      "Server error updating a comment.")
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      logger.warn({user:req.user.name},"User tried to delete nonexisted comment")
      return res.status(400).json({
        message: "Xóa không thành công!",
      });
    }
    logger.info({username:req.user.name}, "user deleted the comment.")
    return res.status(200).json({
      message: "Xóa thành công bình luận",
      datas: deletedComment,
    });
  } catch (error) {
    logger.error({
      error: error, username: req.user.name, email: req.user.email,
      },
      "Server error updating a comment.")
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
