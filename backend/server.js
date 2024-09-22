const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Give files a unique name
  },
});

const upload = multer({ storage: storage });

// Handle audio file uploads
app.post("/upload", upload.single("audioFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  const filePath = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ filePath });
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
