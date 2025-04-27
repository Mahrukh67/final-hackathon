import express from "express";
import userMiddleware from "./middlewares/user.middleware.js";

const router = express.Router();

// // Normal public routes
// router.get("/tasks", (req, res) => {
//   res.send("Public tasks can be seen by anyone.");
// });

// Protected route — only logged-in user can add task
// router.post("/tasks/add", userMiddleware, (req, res) => {
//   res.send("Task added successfully by logged-in user.");
// });

export default router;
