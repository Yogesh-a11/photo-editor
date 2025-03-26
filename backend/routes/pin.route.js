import { Router } from "express";
import { getPin, getPins, createPin } from "../controllers/pin.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const pinRouter = Router();

pinRouter.get('/', getPins)
pinRouter.get('/:id', getPin)
pinRouter.post('/', verifyToken, createPin)

export default pinRouter