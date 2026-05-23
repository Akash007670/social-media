import { logger } from "../utils/logger.js";

const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logger.warn("Access attempted without user id");
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  next();
};

export { authMiddleware };
