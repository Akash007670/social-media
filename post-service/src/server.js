import "dotenv/config.js";
import express from "express";

const app = express();

const PORT = process.env.PORT || 7071;

app.listen(PORT, () => {
  console.log(`Post Service running on PORT: ${PORT}`);
});
