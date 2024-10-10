import React, { useState } from "react";

interface OscillatorProps {
  title: string;
}

const Oscillator: React.FC<OscillatorProps> = ({ title }) => {
  // Step 1: Create a single state object for oscillator properties.
  const [oscState, setOscState] = useState({
    frequency: 440,
    detune: 0,
    waveform: "sine" as OscillatorType,
  });

  // Step 2: Create a function to batch update multiple properties.
  const batchSetOscState = (newState: Partial<typeof oscState>) => {
    setOscState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <div className="oscillator">
      <h4>{title}</h4>
      {/* Frequency Control */}
      <div className="control">
        <label>Frequency</label>
        <input
          type="range"
          min="20"
          max="20000"
          value={oscState.frequency}
          onChange={(e) =>
            batchSetOscState({ frequency: Number(e.target.value) })
          }
        />
      </div>

      {/* Detune Control */}
      <div className="control">
        <label>Detune</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={oscState.detune}
          onChange={(e) => batchSetOscState({ detune: Number(e.target.value) })}
        />
      </div>

      {/* Waveform Control */}
      <div className="control">
        <label>Waveform</label>
        <select
          value={oscState.waveform}
          onChange={(e) =>
            batchSetOscState({ waveform: e.target.value as OscillatorType })
          }
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
    </div>
  );
};

export default Oscillator;
