const express = require("express");
const presetRoutes = require("./presetRoutes");

const router = express.Router();

// All routes will be prefixed with /api
router.use("/", presetRoutes);

module.exports = router;
