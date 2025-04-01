import express from "express";
import { googleAuth } from "../controllers/oauth.controller.js";

const router = express.Router();

router.get("/google", googleAuth);

export default router;
