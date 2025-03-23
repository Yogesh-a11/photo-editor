import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser, followUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const userRouter = Router()

userRouter.get('/:username', getUser)
userRouter.post('/auth/register', registerUser)
userRouter.post('/auth/login', loginUser)
userRouter.post('/auth/logout', logoutUser) 
userRouter.post("/follow/:username", verifyToken,followUser);

export default userRouter
