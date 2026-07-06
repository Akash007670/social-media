import express from "express";
import {
  uploadMedia,
  getMediaById,
  deleteMedia,
} from "../controllers/media-controller.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}); // Use memory storage for multer

router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      next();
    });
  },
  uploadMedia,
);

router.get("/:id", getMediaById);

router.delete("/:id", deleteMedia);

export default router;
