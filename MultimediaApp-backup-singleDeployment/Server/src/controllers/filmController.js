import Film from "../models/film.js";
import filmSchema from "../validations/filmValid.js";
import fs from "fs";
import User from "../models/users.js";
import History from "../models/history.js";
import Genre from "../models/genres.js";
import { error } from "console";
import dotenv from 'dotenv';
dotenv.config();
export const get = async (req, res) => {
  try {
    const film = await Film.find();
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
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getFilm = async (req, res) => {
  try {
    let film = await Film.findOne({ _id: req.params.id });
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
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    let film = await Film.findOne({ _id: req.params.id });
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
    return res.status(500).json({
      message: "loi sever",
    });
  }
};

export const getFilmByGenresId = async (req, res) => {
  try {
    const { genreId } = req.body;
    let films = await Film.find();

    films = films.filter((film) => {
      if (film.genres.includes(genreId)) {
        return film;
      }
    });

    const genre = await Genre.findOne({ _id: genreId });

    return res.status(200).json({ filmList: films, genreName: genre.name });
  } catch (error) {
    console.log(error);
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

    const response = await fetch(`http://${process.env.SERVER_UPLOAD_URL}/uploads`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    filmData.poster_img = data;
    const { error } = filmSchema.validate(filmData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }

    const films = await Film.create(filmData);
    if (!films) {
      return res.status(400).json({
        message: " them khong thanh cong!",
      });
    }

    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      message: " Them thanh cong bo phim",
      datas: films,
    });
  } catch (error) {
    console.log(error);
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
      // Đọc tệp mới từ hệ thống tập tin
      const fileBuffer = fs.readFileSync(req.file.path);
      const blob = new Blob([fileBuffer], { type: req.file.mimetype });
      const formData = new FormData();
      formData.append("file", blob, req.file.filename);

      // Tải tệp mới lên
      const response = await fetch(`http://${process.env.SERVER_UPLOAD_URL}/uploads`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      filmData.poster_img = data;

      // Loại bỏ tệp cũ nếu một tệp mới được tải lên
      const existingFilm = await Film.findById(id);
      if (existingFilm && existingFilm.poster_img) {
        const oldFilePath = `/path/to/uploaded/files/${existingFilm.poster_img.filename}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Xóa tệp vừa được tải lên từ vị trí tạm thời
      fs.unlinkSync(req.file.path);
    }



    // Cập nhật tài liệu phim trong cơ sở dữ liệu
    const updatedFilm = await Film.findByIdAndUpdate(id, filmData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFilm) {
      return res.status(400).json({
        message: "Cập nhật không thành công!",
      });
    }

    return res.status(200).json({
      message: "Cập nhật thành công bộ phim",
      datas: updatedFilm,
    });
  } catch (error) {
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
      return res.status(400).json({
        message: "Xoa khong thanh cong!",
      });
    }
    return res.status(200).json({
      message: " Xoa thanh cong bo phim",
      datas: films,
    });
  } catch (error) {
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
  try {
    const { episodeId } = req.body;
    
    const history = await History.findOne({
      $and: [{ userId: req.user._id }, { episodeId: episodeId }],
    });
    if (!history) {
      return res.status(404).json({ error: "khong tim thay" });
    }
    return res.status(200).json(history);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getFilmByGenres = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: "Không tìm thấy thể loại này" });
    }

    const films = await Film.find({ genres: genre._id });

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
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchFilm = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Search for films with names that contain the search term (case-insensitive)
    const films = await Film.find({ name: new RegExp(name, "i") });

    res.status(200).json(films);
  } catch (error) {
    console.error("Error searching films:", error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for films" });
  }
};

export const ratingFilm = async (req, res) => {
  try {
    const { star, movieId } = req.body;
    const userId = req.user._id;
    const film = await Film.findById(movieId);

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
    res.status(500).json({ message: "Internal server error" });
  }
};
