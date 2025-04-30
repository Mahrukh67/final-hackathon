import express from "express";
import Task from "../models/task.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Create a new task for a user
router.post("/", protect, async (req, res) => {
    try {
      const task = new Task({
        title: req.body.title,
        description: req.body.description,
        assignedTo: req.userId,  // Assign the task to the logged-in user
      });
      await task.save();
      res.status(201).send(task);
    } catch (error) {
      res.status(500).send("Something went wrong.");
    }
  });
  
  // Get all tasks for a specific user
  router.get("/", protect, async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.userId });  // Fetch tasks by userId
      res.send(tasks);
    } catch (error) {
      res.status(500).send("Something went wrong.");
    }
  });

  // Update a task status
router.put("/:id", protect, async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, assignedTo: req.userId }, // ensures only owner can update
        { status: req.body.status },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
  
      res.json(updatedTask);
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  
  // Delete a task
  router.delete("/:id", protect, async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

export default router;
