const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/api/tasks", async (req, res) => {
  const task = new Task({ name: req.body.name, completed: false });
  await task.save();
  res.json(task);
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  await Task.findByIdAndUpdate(id, { completed });
  res.sendStatus(200);
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.sendStatus(200);
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
