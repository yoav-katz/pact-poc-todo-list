import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  taskText: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  currentList: { type: String, default: "General" },
  dueDate: { type: Date } //TODO: date
});

const taskModel = model("Task", taskSchema);

export default taskModel;
