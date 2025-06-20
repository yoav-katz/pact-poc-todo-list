const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskText: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  currentList: { type: String, default: "General" },
  dueDate: { type: String }
  // token: { type: String, required: true }, // Assuming token is used for authentication
});

module.exports = mongoose.model("Task", taskSchema);
