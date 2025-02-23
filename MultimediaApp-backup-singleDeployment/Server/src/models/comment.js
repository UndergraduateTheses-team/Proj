import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Film",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Comment", CommentSchema);
