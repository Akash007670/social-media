import { logger } from "../utils/logger.js";
import { validatePostCreation } from "../utils/validation.js";
import Post from "../models/Post.js";

const createPost = async (req, res) => {
  logger.info("Creating a new post");
  try {
    const { error } = validatePostCreation(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    if (!newlyCreatedPost) {
      logger.warn("Something went wrong in creating post");
      return res
        .status(400)
        .json({ message: "Something went wrong in creating post" });
    }

    await newlyCreatedPost.save();

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully" });
  } catch (error) {
    logger.error(`Error creating post: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createPost };
