// middlewares/sensitiveLimiter.js

import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";
import { logger } from "../utils/logger.js";

export const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // 10 request
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    logger.warn(`Sensitive endpoint limit exceeded IP: ${req.ip}`);

    res.status(429).json({
      success: false,
      message: "Too many requests",
    });
  },

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
