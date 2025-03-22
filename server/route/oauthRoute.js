import express from "express";
import {
  oauthFailureCheck,
  oauthValidate,
} from "../middleware/oauth.middleware";
import { oauthCallback, oauthSignUp } from "../controllers/oauth.controller";

const router = express.Router();

router.route("/auth/google").get(oauthValidate);
router.route("/auth/google/callback").get(oauthFailureCheck, oauthCallback);
router.route("/complete-signup").post(oauthSignUp);
