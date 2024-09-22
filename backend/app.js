// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Initialize dotenv to load .env variables
dotenv.config();

const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON payloads

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const presetRoutes = require("./routes/presetRoutes");
app.use("/api/presets", presetRoutes);

module.exports = app;
