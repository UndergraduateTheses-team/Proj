import Episode from "../models/episode.js";
import episodeSchema from "../validations/episodeValid.js";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
export const getAllEpisodes = async (req, res) => {
  const { movieId } = req.params; // Lấy movieId từ params

  try {
    const episodes = await Episode.find({ movieId });
    res.status(200).json({
      message: "Episodes fetched successfully for the movie",
      data: episodes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching episodes",
      error: error.message,
    });
  }
};

export const createEpisodeForMovie = async (req, res) => {
  const episode = JSON.parse(req.body.info);
  const { error } = episodeSchema.validate(episode);
  if (error) {
    console.log(error);
    return res.status(400).json({
      message: error.details[0].message,
      datas: [],
    });
  }

  // Lấy movieId từ URL thông qua req.params
  const { movieId } = req.params;

  try {
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
      const data = await response.json();
      const filePath = data;

      const newEpisode = new Episode({
        movieId,
        name_episode: episode.name_episode,
        episode_number: episode.episode_number,
        videoUrl: filePath,
      });
      await newEpisode.save();
      fs.unlinkSync(req.file.path);
      return res.status(201).json({
        message: "Episode created successfully for the movie",
        data: newEpisode,
      });
    }
    return res.status(400).json({
      message: "k up duoc video len db",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating episode",
      error: error.message,
    });
  }
};

export const updateEpisodeForMovie = async (req, res) => {
  const { error } = episodeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      datas: [],
    });
  }

  const { episodeId } = req.params; // Lấy episodeId từ params
  const { name_episode, episode_number } = req.body;
  let updateData = {
    name_episode,
    episode_number,
  };

  // Kiểm tra xem có file video mới được upload không
  if (req.file) {
    const videoUrl = `/uploads/${req.file.filename}`;
    updateData.videoUrl = videoUrl; // Cập nhật đường dẫn mới cho video
  }

  try {
    const episode = await Episode.findByIdAndUpdate(
      episodeId,
      updateData,
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    res.status(200).json({
      message: "Episode updated successfully",
      data: episode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating episode",
      error: error.message,
    });
  }
};

export const deleteEpisodeForMovie = async (req, res) => {
  const { episodeId } = req.params; // Lấy episodeId từ params

  try {
    const result = await Episode.findByIdAndDelete(episodeId);
    if (!result) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting episode",
      error: error.message,
    });
  }
};
