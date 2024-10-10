import React, { useState } from "react";

interface ADSRProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
}

const ADSR: React.FC<ADSRProps> = ({ audioContext, gainNode }) => {
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.3);
  const [sustain, setSustain] = useState(0.7);
  const [release, setRelease] = useState(0.5);

  const applyEnvelope = () => {
    if (audioContext && gainNode) {
      const now = audioContext.currentTime;

      // Attack phase
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0, now); // Start from 0 gain
      gainNode.gain.linearRampToValueAtTime(1, now + attack); // Ramp to max gain

      // Decay and Sustain phase
      gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay); // Ramp down to sustain level

      // Release phase (on note-off or stopOscillator)
    }
  };

  const releaseEnvelope = () => {
    if (audioContext && gainNode) {
      const now = audioContext.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.linearRampToValueAtTime(0, now + release); // Ramp down to 0 on release
    }
  };

  return (
    <div className="adsr p-4 border rounded-lg space-y-4">
      <h4>ADSR Envelope</h4>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label>Attack</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={attack}
            onChange={(e) => setAttack(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Decay</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Sustain</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sustain}
            onChange={(e) => setSustain(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Release</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={release}
            onChange={(e) => setRelease(Number(e.target.value))}
          />
        </div>
      </div>
      <button
        onClick={applyEnvelope}
        className="bg-green-500 text-white p-2 rounded"
      >
        Apply ADSR
      </button>
      <button
        onClick={releaseEnvelope}
        className="bg-red-500 text-white p-2 rounded"
      >
        Release
      </button>
    </div>
  );
};

export default ADSR;
