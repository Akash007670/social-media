import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = crypto.randomBytes(40).toString("hex"); // generate a strong hex token string
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: expiresAt,
  });

  return { accessToken, refreshToken };
};

export { generateTokens };
