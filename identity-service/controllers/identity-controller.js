import { logger } from "../utils/logger.js";
import { validateRegistration } from "../utils/validation.js";
import User from "../models/User.js";
import { generateTokens } from "../utils/generateToken.js";

// 1. user registration
const registrationHandler = async (req, res) => {
  logger.info("Registration point hit..");

  console.log(req.body, "Body");
  try {
    if (!req.body) {
      logger.warn("Missing request body");
      return res.status(400).json({ message: "Request body is required" });
    }

    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      logger.warn("User with this email or username already exists");
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    user = new User({
      username,
      email,
      password,
    });
    await user.save();

    const { accessToken, refreshToken } = await generateTokens(user);

    logger.warn("User Registered..", user._id);
    return res.status(201).json({
      success: true,
      message: "User Registered..",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registrationHandler };
