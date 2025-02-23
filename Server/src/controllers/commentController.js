import Comment from "../models/comment.js";
import commentSchema from "../validations/commentValid.js";

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

    return res.status(200).json({
      message: "Bình luận thành công",
      datas: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) {
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
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }
    return res.status(200).json({
      message: "Cập nhật thành công bình luận",
      datas: updatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(400).json({
        message: "Xóa không thành công!",
      });
    }
    return res.status(200).json({
      message: "Xóa thành công bình luận",
      datas: deletedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
