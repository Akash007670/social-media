import { logger } from "../utils/logger.js";
import { validatePostCreation } from "../utils/validation.js";
import Post from "../models/Post.js";

const POST_CACHE_PREFIX = "posts";
const POST_CACHE_TTL_SECONDS = 180; // time to live --> in seconds (3 minutes)

const getPostCacheKey = (page, limit) =>
  `${POST_CACHE_PREFIX}:${page}:${limit}`;
const getPostByIdCacheKey = (postId) => `${POST_CACHE_PREFIX}:${postId}`;

const invalidatePostCache = async (req) => {
  if (!req.redisClient) return;

  try {
    const cachePattern = `${POST_CACHE_PREFIX}:*`;
    const keys = await req.redisClient.keys(cachePattern);

    if (keys.length > 0) {
      await req.redisClient.del(keys);
      logger.info(`Invalidated ${keys.length} post cache keys`);
    }
  } catch (error) {
    logger.error(`Error invalidating post cache: ${error.message}`);
  }
};

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
    await invalidatePostCache(req);

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

    const cacheKey = getPostCacheKey(page, limit);

    logger.info(`Post cache key: ${cacheKey}`);

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
    await req.redisClient.setex(
      cacheKey,
      POST_CACHE_TTL_SECONDS,
      JSON.stringify(result),
    );

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error(`Error fetching posts: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPostById = async (req, res) => {
  logger.info("Fetching post by ID");
  try {
    const postId = req.params.id;

    const cacheKey = getPostByIdCacheKey(postId);
    const cachedPost = await req.redisClient.get(cacheKey);

    if (cachedPost) {
      return res.json({
        success: true,
        message: "Retrieved Cached Post",
        post: JSON.parse(cachedPost),
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      logger.warn(`Post with ID ${postId} not found`);
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await req.redisClient.setex(
      cacheKey,
      POST_CACHE_TTL_SECONDS,
      JSON.stringify(post),
    );

    return res.status(200).json({ success: true, post });
  } catch (error) {
    logger.error(`Error Fetching post : ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  logger.info("Updating a post");

  try {
    const postId = req.params.id;
    const newContent = req.body;

    const updatedPost = await Post.findByIdAndUpdate(postId, newContent, {
      new: true,
    });

    if (!updatedPost) {
      logger.warn(`Post with ID ${postId} not found`);
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Invalidate caches
    await invalidatePostCache(req); // invalidate list caches (posts:*)
    await req.redisClient.del(getPostByIdCacheKey(postId)); // invalidate detail cache (posts:${postId})

    return res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    logger.error(`Error Updating post : ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  logger.info("Deleting a post");

  try {
    const postId = req.params.id;

    const response = await Post.findByIdAndDelete(postId);

    if (!response) {
      logger.warn(`Post with ID ${postId} not found`);
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await invalidatePostCache(req);
    await req.redisClient.del(getPostByIdCacheKey(postId));

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    logger.error(`Error Deleting post : ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { createPost, getAllPost, getPostById, updatePost, deletePost };
