import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

import { createPost, getAllPost } from "../controllers/post-controller.js";

router.use(authMiddleware);

router.post("/create", createPost);

router.get("/all", getAllPost);

export default router;
