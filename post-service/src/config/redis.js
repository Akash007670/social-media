import Redis from "ioredis";
import { logger } from "../utils/logger.js";

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("error", (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

export default redisClient;
