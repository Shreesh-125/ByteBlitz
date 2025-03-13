import express from 'express'
import isAuthenticated from '../middleware/auth.middleware.js';
import { getBlogById, getBlogsByUserName, postBlog } from '../controllers/blog.controller.js';
const router=express.Router()


router.route('/blog').get(isAuthenticated,getBlogById);

export default router;