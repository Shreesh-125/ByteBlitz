<<<<<<< HEAD
import express from "express";
import isAuthenticated from "../middleware/auth.middleware.js";
import { createBlog, login, logout } from "../controllers/admin.controller.js";
const router = express.Router();
=======
import express from 'express'
import isAuthenticated from '../middleware/auth.middleware.js';
import { createBlog, createProblem, login, logout } from '../controllers/admin.controller.js';
import { createContest } from '../controllers/contest.controller.js';
import { postBlog } from '../controllers/blog.controller.js';
const router=express.Router();
>>>>>>> 90bcddaa671f45da6020b06b78c3d1b9a1bf7d6e

router.route("/createblog").post(isAuthenticated, createBlog);
router.route("/login").post(login);
router.route("/logout").get(logout);

<<<<<<< HEAD
export default router;
=======
router.route('/createproblem').post(createProblem);
router.route('/createcontest').post(createContest);
router.route('/createblog').post(isAuthenticated,postBlog);


export default router;
>>>>>>> 90bcddaa671f45da6020b06b78c3d1b9a1bf7d6e
