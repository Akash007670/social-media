import "dotenv/config.js";
import express from "express";
import { connectDb } from "./database/db.js";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import postRoutes from "./routes/post-route.js";
import { logger } from "./utils/logger.js";
import redisClient from "../../api-gateway/src/config/redis.js";

const app = express();

const PORT = process.env.PORT || 7071;

await connectDb();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use(
  "/api/v1/post",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRoutes,
);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.warn(`Post Service running on PORT: ${PORT}`);
});
