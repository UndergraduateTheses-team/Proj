import express from "express";
import {
  allowAccess,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import isAdmin from "../../until/checkIsAdmin.js";
import decodeToken from "../../until/decodeToken.js";
const routerAuth = express.Router();

routerAuth.post("/register", register);
routerAuth.post("/login", login);
routerAuth.post("/logout", logout);
routerAuth.post("/getAccess", decodeToken, isAdmin, allowAccess);

export default routerAuth;
