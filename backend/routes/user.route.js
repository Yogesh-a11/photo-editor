import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get('/:username', getUser)
userRouter.post('/auth/register', registerUser)
userRouter.post('/auth/login', loginUser)
userRouter.post('/auth/logout', logoutUser) 

export default userRouter
