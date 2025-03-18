import { Router } from "express";
import { getPin, getPins } from "../controllers/pin.controller.js";

const pinRouter = Router();

pinRouter.get('/', getPins)
pinRouter.get('/:id', getPin)

export default pinRouter