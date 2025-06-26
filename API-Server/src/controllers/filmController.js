import Film from "../models/film.js";
import filmSchema from "../validations/filmValid.js";
import fs from "fs";
import User from "../models/users.js";
import History from "../models/history.js";
import Genre from "../models/genres.js";
import { error } from "console";
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "../../utils/logger.js"

export const get = async (req, res) => {
  let film;
  try {
    film = await Film.find();
    if (film.length === 0) {
      return res.status(400).json({
        message: " khong ton tai bo fiml nao!",
      });
    }
    return res.status(200).json({
      message: " Tim thanh cong bo phim",
      datas: film,
    });
  } catch (error) {
    logger.error({error, film}, "Server error fetching all films.")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getFilm = async (req, res) => {
  let film;
  try {
    film = await Film.findOne({ _id: req.params.id });
    if (!film) {
      return res.status(400).json({
        message: " khong ton tai bo film nao!",
      });
    }

    return res.status(200).json({
      message: " Tim thanh cong bo phim",
      datas: film,
    });
  } catch (error) {
    console.log(error);
    logger.error({error, film}, "Server error fetching a film.")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getDetail = async (req, res) => {
  let film;
  try {
    film = await Film.findOne({ _id: req.params.id });
    if (!film) {
      return res.status(400).json({
        message: " khong ton tai bo film nao!",
      });
    }
    await film.populate("genres");

    const currentView = film.viewed;

    await Film.updateOne(
      { _id: film._id },
      { $set: { viewed: currentView + 1 } }
    );

    return res.status(200).json({
      message: " Tim thanh cong bo phim",
      datas: film,
    });
  } catch (error) {
    console.log(error);
        logger.error({error, film}, "Server error fetching detail film.")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getFilmByGenresId = async (req, res) => {
  let films;
  try {
    const { genreId } = req.body;
    films = await Film.find();

    films = films.filter((film) => {
      if (film.genres.includes(genreId)) {
        return film;
      }
    });

    const genre = await Genre.findOne({ _id: genreId });

    return res.status(200).json({ filmList: films, genreName: genre.name });
  } catch (error) {
    console.log(error);
    logger.error({error, films}, "Server error fetching film by genres.")
    return res.status(500).json(error);
  }
};

export const create = async (req, res) => {
  let filmData = JSON.parse(req.body.film);
  filmData.releaseDate = Date.now();
  
  try {
    const fileBuffer = fs.readFileSync(req.file.path);

    const blob = new Blob([fileBuffer], { type: req.file.mimetype });

    const formData = new FormData();
    formData.append("file", blob, req.file.filename);

    const response = await fetch(`${process.env.FQDN_MEDIA_SERVER}/uploads/`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    filmData.poster_img = data;
    const { error } = filmSchema.validate(filmData);
    if (error) {
      logger.warn({error, filmData},"Validate film error when creating.")
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }

    const films = await Film.create(filmData);
    if (!films) {
      logger.warn({error, filmData},"Admin failed to add film.")
      return res.status(400).json({
        message: " them khong thanh cong!",
      });
    }

    fs.unlinkSync(req.file.path);
    logger.info({error, filmName: films.name, duration:films.movieDuration, descryption: films.description, releaseddate: films.releaseDate,Status: films.status, director: films.director, actor: films.actors, country: films.country, genre: films.genres},"admin successfully added film.")
    return res.status(200).json({
      message: " Them thanh cong bo phim",
      datas: films,
    });
  } catch (error) {
    console.log(error);
    logger.error({error, filmData}, "Server error create a film.")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    let filmData = req.body.film ? JSON.parse(req.body.film) : {};

    if (req.file) {

      const fileBuffer = fs.readFileSync(req.file.path);
      const blob = new Blob([fileBuffer], { type: req.file.mimetype });
      const formData = new FormData();
      formData.append("file", blob, req.file.filename);


      const response = await fetch(`${process.env.FQDN_MEDIA_SERVER}/uploads/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      filmData.poster_img = data;


      const existingFilm = await Film.findById(id);
      if (existingFilm && existingFilm.poster_img) {
        const oldFilePath = `/path/to/uploaded/files/${existingFilm.poster_img.filename}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }


      await fs.promises.unlink(req.file.path)
      .catch(err => {
        console.warn("Could not remove temp upload:", err);
        logger.warn({userid:req.user.userId, username:req.user.name},"Could not remove temp upload:");
      });
    }



    // Cập nhật tài liệu phim trong cơ sở dữ liệu
    const updatedFilm = await Film.findByIdAndUpdate(id, filmData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFilm) {
      logger.warn({userid:req.user.userId, username:req.user.name},"Update film failed.")
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }
    logger.info({filmData,userid:req.user.userId, username:req.user.name }, "Updated film successfully.")
    return res.status(200).json({
      message: "Cập nhật thành công bộ phim",
      datas: updatedFilm,
    });
  } catch (error) {
    logger.error({error, filmData}, "Server error updating detail film.")
    console.error("Lỗi khi cập nhật phim:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};


export const remove = async (req, res) => {
  try {
    const films = await Film.findByIdAndDelete(req.params.id);
    if (!films) {
      logger.warn({filmName: films.name},"Delete film failed.")
      return res.status(400).json({
        message: "Xoa khong thanh cong!",
      });
    }
    logger.info({filmName: films.name},"Delete film success.")
    return res.status(200).json({
      message: " Xoa thanh cong bo phim",
      datas: films,
    });
  } catch (error) {
    logger.error({error, filmData}, "Server error remove film.")
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const followFilm = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    const film = await Film.findOne({ _id: movieId });
    if (!user) {
      return res.status(404).json({ error: " khong tim thay user" });
    }
    if (!film) {
      return res.status(404).json({ error: " khong tim thay film" });
    }
    const isFollowed = user.favorite.includes(movieId);
    if (isFollowed) {
      user.favorite = user.favorite.filter((id) => id.toString() !== movieId);
      await user.save();
      return res.status(200).json(user);
    } else {
      user.favorite.push(movieId);
      await user.save();
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    logger.error({error, userid: req.user._id, movieId }, "Server error tracking follow film of user.")
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getFollowFilmOfUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ error: "Khong tim thay" });
  }
  const films = await user.populate("favorite");
  return res.status(200).json(films.favorite);
};

export const markEpisodeWatching = async (req, res) => {
  const { episodeId, time } = req.body;
  let history = await History.findOne({ episodeId: episodeId });
  if (!history) {
    history = new History({
      userId: req.user._id,
      episodeId: episodeId,
      timeWatchMovie: time,
    });
    await history.save();
    return res.status(200).json(history);
  }

  history.timeWatchMovie = time;
  await history.save();
};

export const getWatchingTime = async (req, res) => {
  let history;
  try {
    const { episodeId } = req.body;
    
    history = await History.findOne({
      $and: [{ userId: req.user._id }, { episodeId: episodeId }],
    });
    if (!history) {
      return res.status(404).json({ error: "khong tim thay" });
    }
    return res.status(200).json(history);
  } catch (error) {
    console.log(error);
    logger.error({error, history}, "Server error tracking history/watching time of user.")
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getFilmByGenres = async (req, res) => {
  let genre, films;
  try {
    genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: "Không tìm thấy thể loại này" });
    }

    films = await Film.find({ genres: genre._id });

    if (films.length === 0) {
      return res
        .status(400)
        .json({ message: "Không tồn tại phim nào thuộc thể loại này" });
    }

    return res
      .status(200)
      .json({ message: "Tìm thành công phim", datas: films });
  } catch (error) {
    console.error(error.message);
    logger.error({error, films, genre}, "Server error get film by genres of user.")
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchFilm = async (req, res) => {
  let films;
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Search for films with names that contain the search term (case-insensitive)
    films = await Film.find({ name: new RegExp(name, "i") });

    res.status(200).json(films);
  } catch (error) {
    console.error("Error searching films:", error);
    logger.error({error, films}, "Server error searching film.")
    res
      .status(500)
      .json({ message: "An error occurred while searching for films" });
  }
};

export const ratingFilm = async (req, res) => {
  let film;
  try {
    const { star, movieId } = req.body;
    const userId = req.user._id;
    film = await Film.findById(movieId);

    // Tìm user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm phần tử trong mảng rating có movieId trùng với req.body.movieId
    const ratingIndex = user.rating.findIndex(
      (rating) => rating.movie.toString() === movieId
    );

    if (ratingIndex === -1) {
      const rate = {
        movie: movieId,
        rate: star,
      };
      user.rating.push(rate);
      await user.save();
      film.totalPoints += star;
      film.countRating += 1;
      await film.save();

      return res.status(201).json(rate);
    }

    const oldRate = user.rating[ratingIndex].rate;
    user.rating[ratingIndex].rate = star;

    film.totalPoints = film.totalPoints - oldRate + star;
    // Cập nhật rate của phần tử đóar;

    // Lưu đối tượng user sau khi đã cập nhật
    await user.save();
    await film.save();

    // Trả về thông tin user sau khi cập nhật
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    logger.error({error, userid: req.user._id, film}, "Server error about rating film of user.")
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRateOfUser = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const ratingIndex = user.rating.findIndex(
      (rating) => rating.movie.toString() === movieId
    );

    if (ratingIndex === -1) {
      return res.status(404).json({ error: "film chua duoc danh gia" });
    }
    return res.status(200).json(user.rating[ratingIndex].rate);
  } catch (error) {
    console.log(error);
    logger.error({error, userid: req.user._id}, "Server error get rate of user.")
    res.status(500).json({ message: "Internal server error" });
  }
};
