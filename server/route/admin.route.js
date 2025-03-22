import express from 'express'
import isAuthenticated from '../middleware/auth.middleware.js';
import { createBlog, createProblem, login, logout } from '../controllers/admin.controller.js';
import { createContest } from '../controllers/contest.controller.js';
import { postBlog } from '../controllers/blog.controller.js';
const router=express.Router();

router.route("/createblog").post(isAuthenticated, createBlog);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route('/createproblem').post(createProblem);
router.route('/createcontest').post(createContest);
router.route('/createblog').post(isAuthenticated,postBlog);


export default router;
