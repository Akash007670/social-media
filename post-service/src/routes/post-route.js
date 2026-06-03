import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  updatePost,
} from "../controllers/post-controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createPost);

router.get("/all", getAllPost);

router.get("/:id", getPostById);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
