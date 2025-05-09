import express from "express";
import isAuthenticated from "../middleware/auth.middleware.js";
import {
  AdminPostBlog,
  createProblem,
  login,
  logout,
} from "../controllers/admin.controller.js";
import { createContest } from "../controllers/contest.controller.js";
import { postBlog } from "../controllers/blog.controller.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/createproblem").post(createProblem);
router.route("/createcontest").post(createContest);
router.route("/postblog").post(AdminPostBlog);

export default router;
