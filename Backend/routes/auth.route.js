import express from 'express';
import { signup,login,logout,checkAuth,loginAdmin,checkAuthAdmin, forgotPassword, resetPassword} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { protectRouteAdmin } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.post("/forgot-password",forgotPassword); // email bhejna

router.post("/reset-password", resetPassword); // password reset

router.get("/check",protectRoute,checkAuth);

router.get("/checkAdmin",protectRouteAdmin,checkAuthAdmin);

router.post("/loginAdmin",loginAdmin)

export default router;