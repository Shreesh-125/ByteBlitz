import express from "express";
import {
  getProfileDetails,
  getSubmissionDetails,
  getUserContests,
  getUserSubmissions,
  login,
  logout,
  signup,
} from "../controllers/user.controller.js";

const router = express.Router();

//----------------------------------------------Auth-------------------------------------------------------------------------
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").get(logout);

// --------------------------------------------Profile---------------------------------------------------------------------
router.route("/:username").get(getProfileDetails);
router.route("/:username/submissions").get(getUserSubmissions);
router.route("/:username/submissions/:submissionId").get(getSubmissionDetails);
router.route("/:username/contests").get(getUserContests);

export default router;
