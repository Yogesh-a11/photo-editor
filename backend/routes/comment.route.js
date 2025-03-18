import { Router } from "express";
import { getPostComments } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.get("/:postId", getPostComments);

export default commentRouter