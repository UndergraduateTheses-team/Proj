import mongoose, { Schema } from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    episodeId: {
      type: Schema.Types.ObjectId,
      ref: "Episode",
      required: true,
    },
    timeWatchMovie: {
      type: String,
      required: true,
    },
  },  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("History", HistorySchema);
