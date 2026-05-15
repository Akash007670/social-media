import "dotenv/config";
import express from "express";
import { connectDb } from "../database/db.js";
import authRoutes from "../routes/auth-routes.js";
import helmet from "helmet";
import cors from "cors";
import { logger } from "../utils/logger.js";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { errorHandler } from "../middlewares/errorHandler.js";

const app = express();

const PORT = process.env.PORT || 8082;

await connectDb();

const redisClient = new Redis(process.env.REDIS_URL);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received  ${req.method} request to ${req.url}`);
  logger.info(`Received Body  ${req.body}`);
  next();
});

// Ddos protection along with rate limiting

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // This means 10 request
  duration: 1, // This means 1 second
});

// so the general idea is that user can have 10 request in 1 second.

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip) // consume the ip address
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded IP: ${req.ip} `);
      res.status(429).json({ sucess: false, message: "Too many request" });
    }); // rate limiter is consuming the ip address as unique key
});

const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  limit: 10, // limit 10 request
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ sucess: false, message: "Too many request" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

// sensitive handler to register enpoint
app.use("/api/v1/auth/register", sensitiveEndpointsLimiter, authRoutes);

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Error

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
