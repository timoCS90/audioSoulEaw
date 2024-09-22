// models/Preset.js

const mongoose = require("mongoose");

const PresetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  settings: {
    oscType: { type: String, default: "sine" },
    attack: { type: Number, default: 0.1 },
    decay: { type: Number, default: 0.1 },
    sustain: { type: Number, default: 0.5 },
    release: { type: Number, default: 1 },
  },
});

module.exports = mongoose.model("Preset", PresetSchema);
