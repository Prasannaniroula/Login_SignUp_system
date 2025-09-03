import express from "express";
import userAuth from "../middleware/user.middleware.js";
import { getUserData } from "../Controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get('/data',userAuth, getUserData)

export default userRouter;