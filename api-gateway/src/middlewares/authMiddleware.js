import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  logger.warn("In api gateway auth middleware");
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Token not found");
    return res.status(401).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        logger.warn("Invalid token");
        return res.status(401).json({ message: "Invlaid token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { validateToken };
