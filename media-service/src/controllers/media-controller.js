import { logger } from "../utils/logger";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";

export const uploadMedia = async (req, res) => {
  logger.info("Uploading media...");

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimeType } = req.file; // Destructure any necessary properties from req.file if needed
    const userId = req.user.userId; // userId is available in req.user coming from the authentication middleware

    const result = await uploadMediaToCloudinary(req.file);

    console.log(originalname, mimeType);
    console.log(result);

    return res
      .status(200)
      .json({ message: "Media uploaded successfully", data: result });
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
