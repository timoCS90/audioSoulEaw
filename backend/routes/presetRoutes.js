// routes/presetRoutes.js

const express = require("express");
const router = express.Router();
const presetController = require("../controllers/presetController");

router.post("/", presetController.savePreset);
router.get("/", presetController.getAllPresets);
router.get("/:name", presetController.getPresetByName);

module.exports = router;
