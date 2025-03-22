import express from "express";
import isAuthenticated from "../middleware/auth.middleware.js";
import {
  getAllBlog,
  getBlogById,
  getBlogsByUserName,
  postBlog,
} from "../controllers/blog.controller.js";
const router = express.Router();

router.route("/").get(getAllBlog);
router.route("/blog").get(isAuthenticated, getBlogById);

export default router;
