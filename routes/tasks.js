import { Router } from "express";
import Task from './models/Task';

// POST /tasks
const tasksRouter = new Router();

tasksRouter.post("/", async (req, res) => {
  try {
    // Attach owner from authenticated user
    const taskData = { ...req.body, owner: req.user._id };

    const task = new task(taskData);
    await task.save();

    // Optionally add task to user's task list
    req.user.tasks.push(task._id);
    await req.user.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET /tasks
tasksRouter.get("/tasks", async (req, res) => {
  try {
    // Fetch tasks that belong to the user
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// PATCH /:id
tasksRouter.patch("/:id", async (req, res) => {
  try {
    // Ensure the task belongs to the user before updating
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

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
    const task = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    // Remove from user's task list
    req.user.tasks = req.user.tasks.filter(tid => tid.toString() !== req.params.id);
    await req.user.save();

    res.json({ message: "Task deleted", task });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default tasksRouter;