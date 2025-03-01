import express from 'express'
import { login, logout, signup } from '../controllers/user.contoller.js'

const router=express.Router()

router.route('/login').post(login)
router.route('/signup').post(signup);
router.route('/logout').get(logout)

export default router;