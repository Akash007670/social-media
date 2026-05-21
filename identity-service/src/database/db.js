import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Something went wrong in connecting database");
    process.exit(1);
  }
};
