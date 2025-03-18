import { Router } from "express";
import { getUserBoards } from "../controllers/board.controller.js";

const boardRouter = Router();

boardRouter.get("/:userId", getUserBoards )

export default boardRouter