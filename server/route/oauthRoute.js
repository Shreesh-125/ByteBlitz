import express from "express";
import {
  oauthFailureCheck,
  oauthValidate,
} from "../middleware/oauth.middleware.js";
import { oauthCallback, oauthSignUp } from "../controllers/oauth.controller.js";

const router = express.Router();

router.route("/auth/google").get(oauthValidate);
router.route("/auth/google/callback").get(oauthFailureCheck, oauthCallback);
router.route("/complete-signup").post(oauthSignUp);

export default router;