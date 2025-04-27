import express from "express";
import { createTask, updateTask, deleteTask, getTask,} from "../controllers/task.controller.js";
import userMiddleware from './middlewares/userMiddleware.js';

const router = express.Router()

router.post("/create",adminMiddleware , createTask);
router.put("/update/:taskId",userMiddleware , updateTask);
router.delete("/delete/:taskId",userMiddleware , deleteTask);
router.get("/tasks", getTasks);

// purchase course k route ki bat ho rahi hai yahan per or jo function yahan per run hoga wo course wale controller mai likhenge 

export default router;