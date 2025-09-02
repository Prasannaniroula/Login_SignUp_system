import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, verifyEmail, verifyOtp } from "../Controllers/auth.controller.js";
import userAuth from "../middleware/user.middleware.js";

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-otp', userAuth, verifyOtp);
authRouter.post('/verify-account',userAuth, verifyEmail);
authRouter.post('/is-Auth',userAuth, isAuthenticated);
authRouter.post('/resetOtp', sendResetOtp);
authRouter.post('/resetPassword', resetPassword);




export default authRouter;
