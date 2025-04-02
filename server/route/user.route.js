import express from "express";
import {
  deleteUser,
  findUser,
  getHomepageDetails,
  getProfileDetails,
  getSubmissionDetails,
  getUserContests,
  getUserSubmissions,
  login,
  logout,
  signup,
  toggleFriend,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import {
  getBlogById,
  getBlogsByUserName,
  postBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

//----------------------------------------------Auth-------------------------------------------------------------------------
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated, getHomepageDetails);
router.route("/finduser").post(isAuthenticated, findUser);

// --------------------------------------------Profile----------------------------------------------------------------------------
router.route("/:username").get(isAuthenticated, getProfileDetails);
router.route("/:username/submissions").get(isAuthenticated, getUserSubmissions);
router
  .route("/:username/submissions/:submissionId")
  .get(isAuthenticated, getSubmissionDetails);
router.route("/:username/contests").get(isAuthenticated, getUserContests);
router.route("/update-profile").post(isAuthenticated, updateProfile);
router.route("/delete").delete(isAuthenticated, deleteUser);

// ---------------------------------------------Blog---------------------------------------------------------------------------
router.route("/:username/blog").get(isAuthenticated, getBlogsByUserName);
router.route("/createblog").post(isAuthenticated, postBlog);

// ----------------------------------------------Friend------------------------------------------------------------------------
router
  .route("/:userid/friended/:friendusername")
  .post( toggleFriend);

export default router;
