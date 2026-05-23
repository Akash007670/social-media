import { logger } from "../utils/logger.js";
import { validateLogin, validateRegistration } from "../utils/validation.js";
import User from "../models/User.js";
import { generateTokens } from "../utils/generateToken.js";
import RefreshToken from "../models/RefreshToken.js";

// 1. user registration
const registrationHandler = async (req, res) => {
  logger.info("Registration point hit..");

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

const loginHandler = async (req, res) => {
  logger.info("Login point hit..");

  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("User with this email does not exist");
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const isMatch = await user.comparePasswords(password);

    if (!isMatch) {
      logger.warn("Password Incorrect");
      return res
        .status(400)
        .json({ success: false, message: "Password Incorrect" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    logger.info("User Logged in..", user._id);
    return res.status(200).json({
      success: true,
      message: "User Logged in..",
      userId: user._id,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Login error", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshTokenHandler = async (req, res) => {
  logger.info("Refresh token point hit..");

  try {
    if (!req.body || !req.body.refreshToken) {
      logger.warn("Refresh token is required");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
      logger.warn("Refresh token is required");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const token = await RefreshToken.findOne({ token: refreshToken });

    if (!token || token.expiresAt < new Date()) {
      logger.warn("Expired or invalid refresh token");
      return res
        .status(400)
        .json({ message: "Expired or invalid refresh token" });
    }

    const user = await User.findById(token.user); // token.user is the user ID stored in the RefreshToken model

    if (!user) {
      logger.warn("User not found for this token");
      return res.status(400).json({ message: "User not found for this token" });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    // Remove the old refresh token from the database
    await RefreshToken.deleteOne({ _id: token._id });

    logger.info("Token refreshed for user..", user._id);
    return res.status(200).json({
      success: true,
      message: "Token refreshed..",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("Refresh token error", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const logoutHandler = async (req, res) => {
  logger.info("Logout point hit..");

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      logger.warn("Refresh token is required for logout");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    logger.info("User logged out successfully");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Logout error", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  registrationHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
};
