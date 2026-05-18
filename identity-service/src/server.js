import "dotenv/config";
import express from "express";
import { connectDb } from "../database/db.js";
import authRoutes from "../routes/auth-routes.js";
import helmet from "helmet";
import cors from "cors";
import { logger } from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.js";
import { sensitiveEndpointsLimiter } from "../middlewares/sensitiveEndpointLimiter.js";

const app = express();

const PORT = process.env.PORT || 8081;

await connectDb();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

// Global limiter
app.use(rateLimiterMiddleware);

// Sensitive routes
app.use("/api/v1/auth/register", sensitiveEndpointsLimiter, authRoutes);

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`App running on PORT: ${PORT}`);
});
