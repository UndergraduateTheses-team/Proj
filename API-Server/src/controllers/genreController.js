import Genres from "../models/genres.js";
import genreSchema from "../validations/genresValid.js";
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "../../utils/logger.js"

export const getall = async (req, res) => {
  let genre
  try {
    genre = await Genres.find();
    if (genre.length === 0) {
      return res.status(400).json({
        message: " khong ton tai the loai nao!",
      });
    }
    return res.status(200).json({
      message: " Tim thanh cong the loai!",
      datas: genre,
    });
  } catch (error) {
    logger.error({error, genre},"server error not getting all genres")
    return res.status(500).json({
      message: "Loi sever",
    });
  }
};

export const getDetail = async (req, res) => {
  let genre
  try {
    genre = await Genres.findById(req.params.id);
    if (!genre) {
      return res.status(400).json({
        message: " khong ton tai the loai nao!",
      });
    }
    return res.status(200).json({
      message: " Tim thanh cong the loai phim",
      datas: genre,
    });
  } catch (error) {
    logger.error({error, genre},"server error not getting detail of genre")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const create = async (req, res) => {
  let genre
  try {
    const { error } = genreSchema.validate(req.body);
    if (error) {
      logger.warn({error, name: req.user.name, body: req.body},"adding genre failed due to validation.")
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }
  genre = await Genres.create(req.body);
    if (!genre) {
      logger.warn({body: req.body},"Failed to add genre to database")
      return res.status(400).json({
        message: " them the loai khong thanh cong!",
      });
    }
    logger.info({name: req.user.name, body: req.body}, "User added genre successfully.")
    return res.status(200).json({
      message: " Them thanh cong the loai",
      datas: genre,
    });
  } catch (error) {
    logger.error({error, genre},"server error not creating genre")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const update = async (req, res) => {
  let genre
  try {
    const { error } = genreSchema.validate(req.body);
    if (error) {
      logger.warn({name: req.user.name, body: req.body}, "User failed to update genre due to validation.")
      return res.status(400).json({
        message: "loi",
      });
    }
    genre = await Genres.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!genre) {
      logger.warn({name: req.user.name, body: req.body}, "User failed to update genre to database.")
      return res.status(400).json({
        message: "Cap nhat khong thanh cong!",
      });
    }
    logger.info({name: req.user.name, body: req.body}, "User updated genre.")
    return res.status(200).json({
      message: "Cap nhat thanh cong!",
      datas: genre,
    });
  } catch (error) {
    logger.error({error, genre},"server error not updating of genre")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const remove = async (req, res) => {
  let genre
  try {
    genre = await Genres.findByIdAndDelete(req.params.id);
    if (!genre) {
      logger.warn({name: req.user.name, genreid: req.params.id}, "User failed to remove genre.")
      return res.status(400).json({
        message: "Xoa khong thanh cong!",
      });
    }
    logger.info({name: req.user.name, genreid: req.params.id}, "User successfully removing genre.")
    return res.status(200).json({
      message: " Xoa thanh cong bo phim",
      datas: genre,
    });
  } catch (error) {
    logger.error({error, genre},"server error not deleting genre")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getGenresOfFilm = async (genresId) => {
  let genres
  try {
    genres = await Genres.find({ _id: { $in: genresId } });
    return genres;
  } catch (error) {
    logger.error({error, genre},"server error not getting genre of a film")
    console.log(error);
  }
};
