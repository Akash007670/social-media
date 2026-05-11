import "dotenv/config.js";
import express from "express";
import { connectDb } from "../database/db.js";

const app = express();

const PORT = process.env.PORT || 8082;
app.use(express.json());
connectDb();

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
