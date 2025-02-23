import express from "express";
import {
  deleteComment,
  getCommentByMovieId,
  getCountComments,
  postComment,
  updateComment,
} from "../controllers/commentController.js";
import protectRoute from "../../until/decodeToken.js";
const routerComment = express.Router();

routerComment.get("/count/:id", getCountComments);
routerComment.get("/getComment/:id", getCommentByMovieId);
routerComment.post("/createComment", protectRoute, postComment);
routerComment.put("/:id", updateComment);
routerComment.delete("/:id", deleteComment);

export default routerComment;
