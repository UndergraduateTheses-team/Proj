import mongoose, { Schema } from "mongoose";
const EpisodeSchema = new mongoose.Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Film",
      required: true,
    },
    name_episode: {
      type: String,
      required: true,
    },
    episode_number: {
      type: Number,
      required: true,
    },
    videoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Episode", EpisodeSchema);
