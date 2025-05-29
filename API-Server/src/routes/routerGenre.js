import express from "express";
import {
  getall,
  create,
  getDetail,
  update,
  remove,
} from "../controllers/genreController.js";
import protectRoute from "../../utils/decodeToken.js";
import isAdmin from "../../utils/checkIsAdmin.js";
const routerGenre = express.Router();

routerGenre.get("/", getall);
routerGenre.get("/:id", protectRoute, isAdmin, getDetail);
routerGenre.post("/", protectRoute, isAdmin, create);
routerGenre.put("/:id", protectRoute, isAdmin, update);
routerGenre.delete("/:id", protectRoute, isAdmin, remove);

export default routerGenre;
