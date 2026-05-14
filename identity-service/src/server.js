import "dotenv/config";
import express from "express";
import { connectDb } from "../database/db.js";
import authRoutes from "../routes/auth-routes.js";
import helmet from "helmet";
import cors from "cors";
import { logger } from "../utils/logger.js";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const app = express();

const PORT = process.env.PORT || 8082;

await connectDb();

const redisClient = new Redis(process.env.REDIS_URL);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.use((req, res, next) => {
  logger.info(`Received  ${req.method} request to ${req.url}`);
  logger.info(`Received Body  ${req.body}`);
  next();
});

// Ddos protection along with rate limiting

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // This means request
  duration: 1, // This means 1 second
});

// so the general idea is that user can have 10 request in 1 second.

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded IP: ${req.ip} `);
      res.status(429).json({ sucess: false, message: "Too many request" });
    }); // rate limiter is consuming the ip address as unique key
});

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
