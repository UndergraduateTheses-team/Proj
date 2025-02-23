import Genres from "../models/genres.js";
import genreSchema from "../validations/genresValid.js";

export const getall = async (req, res) => {
  
  try {
    const genre = await Genres.find();
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
    return res.status(500).json({
      message: "Loi sever",
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const genre = await Genres.findById(req.params.id);
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
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const create = async (req, res) => {
  
  try {
    const { error } = genreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }
    const genre = await Genres.create(req.body);
    if (!genre) {
      return res.status(400).json({
        message: " them the loai khong thanh cong!",
      });
    }
    return res.status(200).json({
      message: " Them thanh cong the loai",
      datas: genre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { error } = genreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "loi",
      });
    }
    const genre = await Genres.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!genre) {
      return res.status(400).json({
        message: "Cap nhat khong thanh cong!",
      });
    }
    return res.status(200).json({
      message: "Cap nhat thanh cong!",
      datas: genre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const genre = await Genres.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(400).json({
        message: "Xoa khong thanh cong!",
      });
    }
    return res.status(200).json({
      message: " Xoa thanh cong bo phim",
      datas: genre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getGenresOfFilm = async (genresId) => {
  try {
    const genres = await Genres.find({ _id: { $in: genresId } });
    return genres;
  } catch (error) {
    console.log(error);
  }
};
