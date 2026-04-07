// Simple Express server for Skill Gap Finder
// Backend: Node.js + Express + MongoDB (via Mongoose)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// ===== MIDDLEWARE =====
app.use(cors()); // allow all origins for demo purposes
app.use(express.json()); // parse JSON request bodies

// ===== MONGODB CONNECTION =====
// 1. Create a MongoDB Atlas database (or local MongoDB)
// 2. Put your connection string in the MONGODB_URI environment variable
//    Example (PowerShell):
//    $env:MONGODB_URI="your-connection-string-here"
//    node server.js

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skill-gap-finder";

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== DATABASE SCHEMA (User) =====
// Each user document stores:
// - username: unique id (string)
// - goal: selected career goal (string)
// - selectedSkills: array of strings
// - missingSkills: array of strings (calculated on frontend)
// - completedSkills: array of strings (subset of required skills)

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    goal: { type: String, required: true },
    selectedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    completedSkills: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// ===== ROUTES / API ENDPOINTS =====

// Health check (optional)
app.get("/", (req, res) => {
  res.json({ message: "Skill Gap Finder API is running" });
});

// POST /save-user
// Create or update a user document with the latest analysis data
app.post("/save-user", async (req, res) => {
  try {
    const { username, goal, selectedSkills, missingSkills } = req.body;

    if (!username || !goal) {
      return res.status(400).json({ error: "username and goal are required" });
    }

    const safeSelected = Array.isArray(selectedSkills) ? selectedSkills : [];
    const safeMissing = Array.isArray(missingSkills) ? missingSkills : [];

    // If the user already exists, keep their completedSkills
    const existing = await User.findOne({ username });

    let completedSkills = [];
    if (existing) {
      // keep only completed skills that are still relevant
      const combinedRequired = [...new Set([...safeSelected, ...safeMissing])];
      completedSkills = existing.completedSkills.filter((s) =>
        combinedRequired.includes(s)
      );
    }

    const user = await User.findOneAndUpdate(
      { username },
      {
        username,
        goal,
        selectedSkills: safeSelected,
        missingSkills: safeMissing,
        $setOnInsert: { completedSkills }, // only set on first creation
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(user);
  } catch (err) {
    console.error("Error in /save-user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

// GET /user/:id
// Fetch user data by username
app.get("/user/:id", async (req, res) => {
  try {
    const username = req.params.id;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in GET /user/:id:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /update-progress
// Update completed skills for a user
app.put("/update-progress", async (req, res) => {
  try {
    const { username, completedSkills } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }

    const safeCompleted = Array.isArray(completedSkills) ? completedSkills : [];

    const user = await User.findOneAndUpdate(
      { username },
      { completedSkills: safeCompleted },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /update-progress:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

