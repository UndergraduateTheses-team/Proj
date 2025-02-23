import express from "express";
import routerFilm from "./routerFilm.js";
import routerGenre from "./routerGenre.js";
import routerRole from "./routerRole.js";
import routerComment from "./routerComment.js";
import routerAuth from "./routerAuth.js";
import routerUser from "./routerUser.js";
import routerEpisode from "./routerEpisode.js";

const router = express.Router();

router.use("/films", routerFilm);
router.use("/episode", routerEpisode);
router.use("/genres", routerGenre);
router.use("/roles", routerRole);
router.use("/comment", routerComment);
router.use("/auth", routerAuth);
router.use("/user", routerUser);

export default router;
