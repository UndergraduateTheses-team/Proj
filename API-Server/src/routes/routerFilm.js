import express from "express";
import {
  get,
  create,
  getDetail,
  update,
  remove,
  getFilm,
  followFilm,
  getFollowFilmOfUser,
  markEpisodeWatching,
  getWatchingTime,
  getFilmByGenres,
  getFilmByGenresId,
  searchFilm,
  ratingFilm,
  getRateOfUser,
} from "../controllers/filmController.js";
import upload from "../configs/multerConfig.js";
import protectRoute from "../../until/decodeToken.js";
import isAdmin from "../../until/checkIsAdmin.js";

const routerFilm = express.Router();

routerFilm.get("/", get);
routerFilm.post("/update/:id", protectRoute, isAdmin,upload.single("poster"), update);
routerFilm.delete("/:id", protectRoute, isAdmin, remove);
routerFilm.post("/create", protectRoute, isAdmin, upload.single("poster"), create);

routerFilm.get("/get-detail/:id", getDetail);
routerFilm.get("/get/:id", getFilm);
routerFilm.post("/follow", protectRoute, followFilm);
routerFilm.get("/list-favorite", protectRoute, getFollowFilmOfUser);
routerFilm.post("/watching-history", protectRoute, markEpisodeWatching);
routerFilm.post("/get-time", protectRoute, getWatchingTime);
routerFilm.get("/findMovie/:id",  getFilmByGenres);
routerFilm.post("/get-film-by-genre", getFilmByGenresId);
routerFilm.post("/search-film",  searchFilm);
routerFilm.post("/rating", protectRoute, ratingFilm);
routerFilm.post("/getRate", protectRoute, getRateOfUser);
export default routerFilm;
