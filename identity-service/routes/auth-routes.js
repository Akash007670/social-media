import { Router } from "express";
import { registrationHandler } from "../controllers/identity-controller.js";

const router = Router();

router.post("/register", registrationHandler);

export default router;
