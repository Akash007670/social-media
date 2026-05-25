import { logger } from "../utils/logger.js";

const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  console.log("In the authmiddleware");

  if (!userId) {
    logger.warn("Access attempted without user id");
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  req.user = { userId }; // storing the userId details in the req. this can be accessible where this middleware will be used.

  next();
};

export { authMiddleware };
