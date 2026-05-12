import "dotenv/config";
import express from "express";
import { connectDb } from "../database/db.js";
import authRoutes from "../routes/auth-routes.js";

const app = express();

const PORT = process.env.PORT || 8082;

await connectDb();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
