import express from "express";
import { signup , login , logout, task} from "../controllers/auth.controller.js";
import userMiddleware from './middlewares/userMiddleware.js';

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout",logout);
router.get("/task",userMiddleware , task);
export default router;
