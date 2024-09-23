"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as Tone from "tone";
import axios from "axios";

// Synthesizer component
const Synthesizer = () => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [oscType, setOscType] = useState("sine");
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1);
  const [presets, setPresets] = useState([]); // Preset list

  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: oscType },
      envelope: { attack, decay, sustain, release },
    }).toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, [oscType, attack, decay, sustain, release]);

  const handlePlayNote = (note: string) => {
    synth?.triggerAttackRelease(note, "8n");
  };

  // Save preset to the backend
  const savePreset = async (presetName: string) => {
    const settings = { oscType, attack, decay, sustain, release };
    try {
      await axios.post("http://localhost:5000/presets", {
        name: presetName,
        settings,
      });
      alert("Preset saved!");
    } catch (error) {
      console.error("Error saving preset:", error);
    }
  };

  // Load preset from the backend
  const loadPreset = async (presetName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/presets/${presetName}`
      );
      const preset = response.data.settings;
      setOscType(preset.oscType);
      setAttack(preset.attack);
      setDecay(preset.decay);
      setSustain(preset.sustain);
      setRelease(preset.release);
    } catch (error) {
      alert("Preset not found!");
      console.error("Error loading preset:", error);
    }
  };

  // Fetch all presets
  const fetchPresets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/presets");
      setPresets(response.data);
    } catch (error) {
      console.error("Error fetching presets:", error);
    }
  };

  // Fetch presets on component load
  useEffect(() => {
    fetchPresets();
  }, []);

  return (
    <SynthContainer>
      <h1>Advanced Synthesizer</h1>

      <div>
        <h2>Oscillator Type</h2>
        <select value={oscType} onChange={(e) => setOscType(e.target.value)}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </div>

      <div>
        <h2>Envelope (ADSR)</h2>
        <label>Attack: {attack.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={attack}
          onChange={(e) => setAttack(parseFloat(e.target.value))}
        />
        <label>Decay: {decay.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={decay}
          onChange={(e) => setDecay(parseFloat(e.target.value))}
        />
        <label>Sustain: {sustain.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sustain}
          onChange={(e) => setSustain(parseFloat(e.target.value))}
        />
        <label>Release: {release.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={release}
          onChange={(e) => setRelease(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <h2>Play Notes</h2>
        <button onClick={() => handlePlayNote("C4")}>C4</button>
        <button onClick={() => handlePlayNote("D4")}>D4</button>
        <button onClick={() => handlePlayNote("E4")}>E4</button>
      </div>

      <div>
        <h2>Presets</h2>
        <input type="text" placeholder="Preset Name" id="presetName" />
        <button
          onClick={() => {
            const presetName = (
              document.getElementById("presetName") as HTMLInputElement
            ).value;
            savePreset(presetName);
          }}
        >
          Save Preset
        </button>
        <button
          onClick={() => {
            const presetName = (
              document.getElementById("presetName") as HTMLInputElement
            ).value;
            loadPreset(presetName);
          }}
        >
          Load Preset
        </button>

        <h3>Available Presets:</h3>
        <ul>
          {presets.map((preset: any) => (
            <li key={preset._id}>{preset.name}</li>
          ))}
        </ul>
      </div>
    </SynthContainer>
  );
};

// Styled Components
const SynthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  select,
  input,
  button {
    margin: 5px;
  }
`;

export default Synthesizer;
