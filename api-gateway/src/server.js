import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import proxy from "express-http-proxy";

const app = express();

const PORT = process.env.PORT || 9091;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  },
  proxyErrorHandler: (err, res) => {
    logger.error(`Error proxying request: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  },
};

// rate limiter middleware
app.use(rateLimiter);

// Proxy route for register endpoint
app.use(
  "/api/v1/auth/register",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      // Log the response from the identity service
      logger.info(
        `Response from Identity Service for ${userReq.method} ${userReq.url}: ${proxyRes.statusCode}`,
      );
      return proxyResData;
    },
  }),
);

// proxy route for auth endpoint
app.use("/api/v1/auth", proxy(process.env.IDENTITY_SERVICE_URL, proxyOptions));

// error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on PORT: ${PORT}`);
});
