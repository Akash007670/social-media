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

    const cacheKeys = await req.redisClient.keys("Post:*");
    if (cacheKeys.length > 0) {
      await req.redisClient.del(cacheKeys);
    }

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully" });
  } catch (error) {
    logger.error(`Error creating post: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllPost = async (req, res) => {
  logger.info("Fetching all posts");
  try {
    const page = parseInt(req.query.page) || 1; // query parameter
    const limit = parseInt(req.query.limit) || 10; // query parameter

    const offset = (page - 1) * limit; // calculate offset here.

    // Add caching

    const cacheKey = `Post:${page}:${limit}`;

    console.log(cacheKey, "Cache key");

    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.json({
        success: true,
        message: "Retrieved Cached Posts",
        posts: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit); // sort and add pagination using limit and offset.
    const totalPosts = await Post.countDocuments(); // Gives total No. of document present in db.

    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
    };

    // If fetched first time then save the result in cache
    await req.redisClient.setex(cacheKey, 60, JSON.stringify(result));

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error(`Error fetching posts: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createPost, getAllPost };
