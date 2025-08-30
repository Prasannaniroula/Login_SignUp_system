import express from "express";
import { login, logout, register, verifyEmail, verifyOtp } from "../Controllers/auth.controller.js";
import userAuth from "../middleware/user.middleware.js";

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-otp', userAuth, verifyOtp);
authRouter.post('/verify-account',userAuth, verifyEmail);


export default authRouter;
