import "dotenv/config.js";
import express from "express";
import { connectDb } from "./database/db.js";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";

const app = express();

const PORT = process.env.PORT || 6061;

await connectDb();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.warn(`Media Service running on PORT: ${PORT}`);
});
