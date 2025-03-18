import express from "express";
import isAuthenticated from "../middleware/auth.middleware.js";
import { createBlog, login, logout } from "../controllers/admin.controller.js";
const router = express.Router();

router.route("/createblog").post(isAuthenticated, createBlog);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;
