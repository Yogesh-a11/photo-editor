import { Router } from "express";
import { addComment, getPostComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const commentRouter = Router();

commentRouter.get("/:postId", getPostComments);
commentRouter.post("/", verifyToken, addComment);

export default commentRouter