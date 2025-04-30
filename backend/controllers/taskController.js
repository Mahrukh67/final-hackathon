import { Task } from "../models/task.js";
import { createTask, updateTask, deleteTask, getTask } from "./taskController.js";

import Task from '../models/task.js';

export const createTask = async (req, res) => {
  const userId = req.userId; // Get userId from middleware (assuming protect middleware is set up)
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ errors: "All fields are required." });
  }

  try {
    const task = new Task({ title, description, assignedTo: userId, status: 'To Do' });
    await task.save();
    res.status(201).json({ message: "Task Created Successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating task" });
  }
};


// Task update function
export const updateTask = async (req, res) => {
    const userId = req.userId;
    const { taskId } = req.params;
    const { title, description } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ errors: "Task not found" });
        }

       

    
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, creatorId: userId },
            {
                title,
                description,
             
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ errors: "Can't update, created by another user." });
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });

    } catch (error) {
        console.log("Error in task updating", error);
        res.status(500).json({ errors: "Error in task updating" });
    }
};

// Task delete function
export const deleteTask = async (req, res) => {
    const userId = req.userId;
    const { taskId } = req.params;

    try {
        const task = await Task.findOneAndDelete({
            _id: taskId,
            creatorId: userId,
        });
        if (!task) {
            return res.status(404).json({ errors: "Can't delete, created by another user." });
        }
        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.log("Error in deleting task", error);
        res.status(500).json({ errors: "Error in task deleting" });
    }
};

// Get all tasks function
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    } catch (error) {
        console.log("Error to get tasks", error);
        res.status(500).json({ errors: "Error in getting tasks" });
    }
};

// Particular task detail
export const taskDetails = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ task });
    } catch (error) {
        console.log("Error in task details", error);
        res.status(500).json({ errors: "Error in getting task details" });
    }
};
