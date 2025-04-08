const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// MongoDB connection
const MONGO_URI = "mongodb+srv://tojee:tojee@cluster0.gqbnp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if cannot connect to database
  }
};

connectDB();

// Define a Mongoose schema and model
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

// Route to insert sample data
app.get("/insert-sample", async (req, res) => {
  try {
    const sampleTasks = [
      { task: "sdsadsad  1" },
      { task: "Sample Task 2" },
      { task: "Sample Task 3" },
    ];
    await Task.insertMany(sampleTasks);
    res.send("Sample tasks inserted successfully!");
  } catch (error) {
    console.error("Error inserting sample tasks:", error);
    res.status(500).send("Error inserting sample tasks");
  }
});

// Route to insert data from the frontend
app.post("/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }
    const newTask = new Task({ task });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send("Error adding task");
  }
});

// Route to fetch all tasks from the database
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks");
  }
});

// Route to delete a task from the database
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
});

// Route to edit a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    
    console.log('Updating task:', { id, task }); // Log the update request

    if (!task) {
      console.log('Task text is missing');
      return res.status(400).json({ error: "Task text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid task ID:', id);
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // First check if the task exists
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      console.log('Task not found in database:', id);
      return res.status(404).json({ 
        error: "Task not found",
        details: `No task found with ID: ${id}`
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    console.log('Task updated successfully:', updatedTask);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ 
      error: "Error updating task",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
