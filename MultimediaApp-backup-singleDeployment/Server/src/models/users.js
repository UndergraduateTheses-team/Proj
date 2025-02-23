import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      defaults: null,
    },
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "Film",
        required: true,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    rating: [
      {
        movie: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", UserSchema);
