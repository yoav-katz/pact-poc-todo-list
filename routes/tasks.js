import { Router } from "express";
import Task from '../models/task.js';
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// POST /task
const tasksRouter = new Router();

tasksRouter.post("/", async (req, res) => {
  try {
    const taskData = req.body;

    const task = new Task(taskData);
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({error: "Bad Format", body: req.body});
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET /task
tasksRouter.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// PATCH /:id
tasksRouter.patch("/:id", async (req, res) => {
  try {

    const task = await Task.findOne({ _id: ObjectId.createFromHexString(req.params.id) });
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /:id
tasksRouter.delete("/:id", async (req, res) => {
  try {
    // Ensure the task belongs to the user before deleting
    const task = await Task.findOneAndDelete({ _id: ObjectId.createFromHexString(req.params.id) });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted", task });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default tasksRouter;