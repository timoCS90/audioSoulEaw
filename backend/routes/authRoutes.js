const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
