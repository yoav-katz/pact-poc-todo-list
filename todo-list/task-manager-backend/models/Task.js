const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskText: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  currentList: { type: String, default: "General" },
  dueDate: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
