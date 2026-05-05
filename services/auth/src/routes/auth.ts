import express from "express";
import {loginUser, logoutUser, addUserRole, myProfile } from "../controllers/auth.js";
import { isAuth } from '../middlewares/isAuth.js';
const router = express.Router();


router.post('/login', loginUser)
router.post('/logout', isAuth, logoutUser)
router.put('/add/role',isAuth,addUserRole)
router.get('/me',isAuth,myProfile)
export default router;