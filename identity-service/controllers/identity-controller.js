import { logger } from "../utils/logger.js";
import { validateRegistration } from "../utils/validation.js";
import User from "../models/User.js";

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

    const user = await User.findOne({ email: email });

    if (user) {
      logger.warn("User with this email already exists");
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const payload = {
      username,
      email,
      password,
    };

    user = new User(payload);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Registration Successful" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registrationHandler };
