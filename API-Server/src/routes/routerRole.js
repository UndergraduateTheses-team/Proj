import express from "express";
import {
  getall,
  create,
  getDetail,
  update,
  remove,
} from "../controllers/roleController.js";
const routerRole = express.Router();
import protectRoute from "../../until/decodeToken.js";
import isAdmin from "../../until/checkIsAdmin.js";

routerRole.get("/", protectRoute, isAdmin, getall);
routerRole.get("/:id", protectRoute, isAdmin, getDetail);
routerRole.post("/", protectRoute, isAdmin, create);
routerRole.put("/:id", protectRoute, isAdmin, update);
routerRole.delete("/:id", protectRoute, isAdmin, remove);

export default routerRole;
