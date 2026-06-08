import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.warn("No token provided");
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
