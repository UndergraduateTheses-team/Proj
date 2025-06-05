import Episode from "../models/episode.js";
import episodeSchema from "../validations/episodeValid.js";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "../../utils/logger.js"


export const getAllEpisodes = async (req, res) => {
  const { movieId } = req.params;
  try {
    const episodes = await Episode.find({ movieId });
    res.status(200).json({
      message: "Episodes fetched successfully for the movie",
      data: episodes,
    });
  } catch (error) {
    logger.error({error:error, 
      movieId: req.params.movieId,   
    }, "Server error getting all episodes failed")
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
    logger.warn({error, episode, userid:req.userid}, "Episode validate error when trying to add episode for movie")
    console.log(error);
    return res.status(400).json({
      message: error.details[0].message,
      datas: [],
    });
  }

  // Lấy movieId từ URL thông qua req.params
  const { movieId } = req.params;

  async function fetchWithTimeout(url, options, timeout) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    );
  
    return Promise.race([
      fetch(url, options),   
      timeoutPromise
    ]);
  }

  try {
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);

      const blob = new Blob([fileBuffer], { type: req.file.mimetype });

      const formData = new FormData();
      formData.append("file", blob, req.file.filename);

      const response = await fetchWithTimeout(
        `${process.env.FQDN_MEDIA_SERVER}/uploads/`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
        10000000 // Timeout set to 10,000,000 ms (around 2.77 hours)
      );
      
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
      logger.info({newEpisode, userid: req.userid}, "User created episode for movie. Check movieid in detail info.")
      return res.status(201).json({
        message: "Episode created successfully for the movie",
        data: newEpisode,
      });
    }
    logger.warn({userid: req.userid},"req.file non exist. User failed to upload to database ")
    return res.status(400).json({
      message: "k up duoc video len db",
    });
  } catch (error) {
    console.log(error);
    logger.error({error:error, 
        movieId: req.params.movieId,
        episodeId: episode.episodeId,
        name_episode: episode.name_episode,
        episode_number: episode.episode_number,
        videoUrl: filePath,
    },
      
      "Server error creating new episode.")
    res.status(500).json({
      message: "Error creating episode",
      error: error.message,
    });
  }
};

export const updateEpisodeForMovie = async (req, res) => {
  const { error } = episodeSchema.validate(req.body);
  if (error) {
    logger.warn({error, user: req.user.name, userid: req.user.userid, name: req.user.name},"User faield to update episode for movie")
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
      logger.warn({user: req.user.name, userid: req.user.userid, name: req.user.name},"Episode not found, can't update episode.")
      return res.status(404).json({ message: "Episode not found" });
    }
    logger.info({user: req.user.name, userid: req.user.userid, name: req.user.name},"User update episode successfully")
    res.status(200).json({
      message: "Episode updated successfully",
      data: episode,
    });
  } catch (error) {
      logger.error({error:error, 
          updateData: updateData,
          episodeId: episodeId,
          episode_number: episode_number,
          name_episode: name_episode,
      },
        
        "Server error updating new episode.")
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
    logger.warn({user: req.user.name, userid: req.user.userid, name: req.user.name},"Episode not found when trying to delete episode.")
    if (!result) {
      return res.status(404).json({ message: "Episode not found" });
    }
    logger.info({user: req.user.name, userid: req.user.userid, name: req.user.name}, "Episode deleted by user.")
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    logger.error({error:error,
        episodeId: req.params.episodeId, 
        name_episode: req.params.name_episode,
        episode_number: req.params.episode_number,
      },
        
      "Server error deleting episode.")
    res.status(500).json({
      message: "Error deleting episode",
      error: error.message,
    });
  }
};
