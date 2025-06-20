require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require('crypto');

const mailjet = require('node-mailjet');
const client = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

const app = express();
app.use(cors());
app.use(express.json());

const Task = require("./models/Task");
const Folder = require("./models/Folder");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// POST /api/email - send a test email using Mailjet
app.post('/api/email', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: 'Missing email address in "to"' });

  try {
    const request = client
      .post("send", {'version': 'v3.1'})
      .request({
        Messages:[
          {
            From: {
              Email: process.env.MJ_SENDER_EMAIL,
              Name: "CheckList App"
            },
            To: [
              {
                Email: to,
                Name: "User"
              }
            ],
            Subject: "Logging in to the CheckList App",
            HTMLPart: "<h1>Welcome to the CheckList App!</h1><br><h3>Thanks for logging in! <br> Here is your magic link:<a href='https://your-app-url.com/login'>click here</a></h3>"
          }
        ]
      });

    const result = await request;
    res.status(200).json({ message: 'Email sent successfully', result: result.body });
  } catch (err) {
    console.error('Error sending email:', err.statusCode, err.message || err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/login - create/update user and send login link using Mailjet
app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const token = crypto.randomBytes(32).toString('hex');

    let user = await User.findOne({ email });
    if (!user) {
      const username = email.split('@')[0];
      user = new User({ email, username, token });
    } else {
      user.token = token;
    }
    await user.save();

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const loginUrl = `${baseUrl}/login/${token}`;

    const request = client
      .post("send", {'version': 'v3.1'})
      .request({
        Messages:[
          {
            From: {
              Email: process.env.MJ_SENDER_EMAIL,
              Name: "CheckList app"
            },
            To: [
              {
                Email: email,
                Name: "User"
              }
            ],
            Subject: "Your Login Link",
            HTMLPart: `<p>Click the link below to log in:</p><p><a href="${loginUrl}">${loginUrl}</a></p>`
          }
        ]
      });

    await request;

    res.json({ message: 'Login link sent to your email' });
  } catch (err) {
    console.error('Login route error:', err.statusCode, err.message || err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    console.log("Saved new task:", savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: "Failed to save task", error });
  }
});

// POST /api/folders - create a new folder
app.post('/api/folders', async (req, res) => {
  try {
    const newFolder = new Folder(req.body);
    const savedFolder = await newFolder.save();
    console.log("Saved new folder:", savedFolder);
    res.status(201).json(savedFolder);
  } catch (error) {
    console.error("Error saving folder:", error);
    res.status(500).json({ message: "Failed to save folder", error });
  }
});

// GET /api/tasks - fetch all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
});

// GET /api/folders - fetch all folders
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch folders", error });
  }
});

// DELETE /api/tasks/:id - delete task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

// DELETE /api/folders/:id - delete folder by ID
app.delete('/api/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFolder = await Folder.findByIdAndDelete(id);
    if (!deletedFolder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json({ message: 'Folder deleted successfully', deletedFolder });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Failed to delete folder', error });
  }
});

// PATCH /api/tasks/:id - update task
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
