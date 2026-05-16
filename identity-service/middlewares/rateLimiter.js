// middlewares/rateLimiter.js

import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.js";
import { logger } from "../utils/logger.js";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded IP: ${req.ip}`);

      res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    });
};
