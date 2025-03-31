import express from "express";
import {
  getAllUsers,
  getUserDetail,
  updateUser,
  editUser,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";
import upload from "../configs/multerConfig.js";
import protectRoute from "../../until/decodeToken.js";
const routerUser = express.Router();

routerUser.get("/", getAllUsers);
routerUser.get("/user-by-id/:id",protectRoute, getUserDetail);
routerUser.post("/update/:id", protectRoute,upload.single("avatar"), updateUser);
routerUser.put("/edit/:user_email", editUser);
routerUser.delete("/delete/:id",protectRoute, deleteUser);
routerUser.put("/changePassword/:id",protectRoute, changePassword);
export default routerUser;
