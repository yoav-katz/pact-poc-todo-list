require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const mailjet = require("node-mailjet");

const client = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
const app = express();
app.use(cors());
app.use(express.json());

// Models
const Task = require("./models/Task");
const Folder = require("./models/Folder");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------- AUTH MIDDLEWARE --------------------
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Malformed Authorization header" });
  }

  const token = parts[1];
  const user = await User.findOne({ token });
  if (!user) return res.status(401).json({ error: "Invalid token" });

  req.user = user;
  next();
};
// -------------------- MIDDLEWARE --------------------
async function getAllUsers() {
  try {
    const users = await User.find();  // no filter = all users
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// -------------------- ROUTES --------------------

// POST /api/email - test email
app.post("/api/email", async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: 'Missing "to" email' });

  try {
    const request = client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MJ_SENDER_EMAIL,
            Name: "CheckList App",
          },
          To: [{ Email: to, Name: "User" }],
          Subject: "Logging in to the CheckList App",
          HTMLPart: "<h1>Welcome to CheckList!</h1><p>This is a test email.</p>",
        },
      ],
    });

    const result = await request;
    res.status(200).json({ message: "Email sent", result: result.body });
  } catch (err) {
    console.error("Mailjet error:", err.message || err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/login - issue token + send login link
app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const token = crypto.randomBytes(32).toString("hex");

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, token });
    } else {
      user.token = token;
    }
    await user.save();

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const loginUrl = `${baseUrl}/login/auth?token=${token}`;

    const request = client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MJ_SENDER_EMAIL,
            Name: "CheckList App",
          },
          To: [{ Email: email, Name: "User" }],
          Subject: "Your Login Link",
          HTMLPart: `<p>Click <a href="${loginUrl}">here</a> to log in to your checklist!</p>`,
        },
      ],
    });

    await request;
    res.json({ message: "Login link sent to your email" });
  } catch (err) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- TASK ROUTES --------------------

// POST /api/tasks
app.post("/api/tasks", authenticate, async (req, res) => {
  try {
    // Attach owner from authenticated user
    const taskData = { ...req.body, owner: req.user._id };

    const task = new Task(taskData);
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

// GET /api/tasks
app.get("/api/tasks", authenticate, async (req, res) => {
  try {
    // Fetch tasks that belong to the user
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/tasks/:id
app.patch("/api/tasks/:id", authenticate, async (req, res) => {
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

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", authenticate, async (req, res) => {
  try {
    // Ensure the task belongs to the user before deleting
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
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

// -------------------- FOLDER ROUTES --------------------

// POST /api/folders
app.post("/api/folders", authenticate, async (req, res) => {
  try {
    const newFolder = new Folder(req.body);
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    console.error("Error saving folder:", error);
    res.status(500).json({ message: "Failed to save folder" });
  }
});

// GET /api/folders
app.get("/api/folders", authenticate, async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch folders" });
  }
});

// DELETE /api/folders/:id
app.delete("/api/folders/:id", authenticate, async (req, res) => {
  try {
    const deletedFolder = await Folder.findByIdAndDelete(req.params.id);
    if (!deletedFolder) return res.status(404).json({ message: "Folder not found" });
    res.json({ message: "Folder deleted", deletedFolder });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Failed to delete folder" });
  }
});

// -------------------- USER CHECK --------------------

// GET /api/users?email=someone@example.com
app.get('/api/users', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    const user = await User.findOne({ email }).select('email');
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
