import { logger } from "../utils/logger";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import Media from "../models/media.js";

export const uploadMedia = async (req, res) => {
  logger.info("Uploading media...");

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimeType } = req.file; // Destructure any necessary properties from req.file if needed
    const userId = req.user.userId; // userId is available in req.user coming from the authentication middleware

    logger.info(
      `User ID: ${userId}, File Name: ${originalname}, MIME Type: ${mimeType}`,
    );

    const result = await uploadMediaToCloudinary(req.file);

    logger.info(`Media uploaded successfully: ${JSON.stringify(result)}`);

    const newlyCreatedMedia = new Media({
      userId: userId,
      publicId: result.public_id,
      originalName: originalname,
      mimeType: mimeType,
      url: result.secure_url,
      cloudinaryPublicId: result.public_id,
    });

    await newlyCreatedMedia.save();

    return res.status(200).json({
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media uploaded successfully",
    });
  } catch (error) {
    logger.error("Error uploading media:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMediaById = async (req, res) => {
  return res.status(501).json({ message: "Not implemented: getMediaById" });
};

export const deleteMedia = async (req, res) => {
  return res.status(501).json({ message: "Not implemented: deleteMedia" });
};
