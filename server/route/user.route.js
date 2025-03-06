import express from 'express'
import { findUser, getHomepageDetails, getProfileDetails, getSubmissionDetails, getUserContests, getUserSubmissions, login, logout, signup } from '../controllers/user.controller.js'
import isAuthenticated from '../middleware/auth.middleware.js';
import { getBlogById, getBlogsByUserName, postBlog } from '../controllers/blog.controller.js';


const router = express.Router();

//----------------------------------------------Auth-------------------------------------------------------------------------
router.route('/login').post(login)
router.route('/signup').post(signup);
router.route('/logout').get(logout);
router.route('/').get(isAuthenticated,  getHomepageDetails)
router.route('/finduser').post(isAuthenticated,findUser);

// --------------------------------------------Profile----------------------------------------------------------------------------
router.route('/:username').get(isAuthenticated ,getProfileDetails)
router.route('/:username/submissions').get(isAuthenticated,getUserSubmissions);
router.route('/:username/submissions/:submissionId').get(isAuthenticated,getSubmissionDetails)
router.route("/:username/contests").get(isAuthenticated,getUserContests);

// ---------------------------------------------Blog---------------------------------------------------------------------------
router.route('/createblog').post(isAuthenticated,postBlog);
router.route('/:username/blog').get(isAuthenticated,getBlogsByUserName);
router.route('/blog/:id').get(isAuthenticated,getBlogById);


export default router;
