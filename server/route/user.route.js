import express from "express";
import {
  deleteProfilePic,
  deleteUser,
  findUser,
  getfriends,
  getHomepageDetails,
  getProfileDetails,
  getRankingList,
  getRecentSubmission,
  getSubmissionDetails,
  getUserContests,
  getUserSubmissions,
  isFriend,
  login,
  logout,
  signup,
  toggleFriend,
  updateProfile,
  uploadProfilePic,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import {
  getBlogById,
  getBlogsByUserName,
  postBlog,
} from "../controllers/blog.controller.js";
import { handleProfilePicUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

//----------------------------------------------Auth-------------------------------------------------------------------------
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").get(logout);
router.route("/find/findusers").post(findUser);
router.route("/").get(getHomepageDetails);

// --------------------------------------------Profile----------------------------------------------------------------------------
router.route("/:username").get( getProfileDetails);
router.route("/:username/submissions").get(isAuthenticated, getUserSubmissions);
router
  .route("/:username/submissions/:submissionId")
  .get(isAuthenticated, getSubmissionDetails);
router.route("/:username/contests").get(getUserContests);
router
  .route("/getrecentsubmission/:username")
  .get(isAuthenticated, getRecentSubmission);
router.route("/update-profile").post(isAuthenticated, updateProfile);
router.route("/delete").delete(isAuthenticated, deleteUser);

// ---------------------------------------------Blog---------------------------------------------------------------------------
router.route("/:username/blog").get( getBlogsByUserName);
router.route("/createblog").post(isAuthenticated, postBlog);

router.route("/global/ranking").get(getRankingList);
// ----------------------------------------------Friend------------------------------------------------------------------------
router.route("/:userid/friended/:friendusername").post(toggleFriend);

router.post('/upload/profile-pic/:username',handleProfilePicUpload,uploadProfilePic);

router.delete('/delete/profile-pic/:username',deleteProfilePic);

router.route(`/:userid/isFriend/:friendUsername`).get(isFriend);

router.route(`/getfriends/:username`).get(getfriends);

export default router;
