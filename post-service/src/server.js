import "dotenv/config.js";
import express from "express";
import postRoutes from "./routes/post-route.js";

const app = express();

const PORT = process.env.PORT || 7071;

app.use(express.json());

app.use("/api/v1/post", postRoutes);

app.listen(PORT, () => {
  console.log(`Post Service running on PORT: ${PORT}`);
});
