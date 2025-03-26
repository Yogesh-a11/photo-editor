import { Router } from "express";
import { getPin, getPins, createPin, interactionCheck, interact } from "../controllers/pin.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const pinRouter = Router();

pinRouter.get('/', getPins)
pinRouter.get('/:id', getPin)
pinRouter.post('/', verifyToken, createPin)
pinRouter.get('/interaction-check/:id', interactionCheck )
pinRouter.post('/interact/:id',verifyToken, interact )

export default pinRouter 