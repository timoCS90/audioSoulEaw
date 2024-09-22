// controllers/presetController.js

const Preset = require("../models/Preset");

// Save a new preset
exports.savePreset = async (req, res) => {
  const { name, settings } = req.body;
  try {
    const newPreset = new Preset({ name, settings });
    await newPreset.save();
    res.status(201).json(newPreset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch all presets
exports.getAllPresets = async (req, res) => {
  try {
    const presets = await Preset.find();
    res.status(200).json(presets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch a preset by name
exports.getPresetByName = async (req, res) => {
  const { name } = req.params;
  try {
    const preset = await Preset.findOne({ name });
    if (!preset) {
      return res.status(404).json({ message: "Preset not found" });
    }
    res.status(200).json(preset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
