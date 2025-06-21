const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to populate tasks owned by this user
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

module.exports = mongoose.model("User", userSchema);
