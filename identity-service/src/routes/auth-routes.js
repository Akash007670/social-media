import { Router } from "express";
import {
  loginHandler,
  registrationHandler,
  refreshTokenHandler,
} from "../controllers/identity-controller.js";

const router = Router();

router.post("/", registrationHandler);

router.post("/login", loginHandler);

router.post("/refresh-token", refreshTokenHandler);

export default router;
