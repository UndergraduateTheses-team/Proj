import express from "express";
import {
  deleteEpisodeForMovie,
  getAllEpisodes,
  createEpisodeForMovie,
  updateEpisodeForMovie,
} from "../controllers/episodeController.js";
import upload from "../configs/multerConfig.js";
import protectRoute from "../../until/decodeToken.js";
import isAdmin from "../../until/checkIsAdmin.js";
const routerEpisode = express.Router();

routerEpisode.get("/:movieId", protectRoute, getAllEpisodes);
routerEpisode.post(
  "/:movieId",
  protectRoute,
  isAdmin,
  upload.single("video"),
  createEpisodeForMovie
);
routerEpisode.put(
  "/:episodeId",
  protectRoute,
  isAdmin,
  upload.single("video"),
  updateEpisodeForMovie
);
routerEpisode.delete(
  "/:episodeId",
  protectRoute,
  isAdmin,
  deleteEpisodeForMovie
);

export default routerEpisode;
