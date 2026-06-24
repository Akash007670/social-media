import express from "express";
import {
  uploadMedia,
  getMediaById,
  deleteMedia,
} from "../controllers/media-controller.js";

const router = express.Router();

router.post("/upload", uploadMedia);

router.get("/:id", getMediaById);

router.delete("/:id", deleteMedia);

export default router;
