import React, { useState, useEffect, useRef } from "react";

interface LFOProps {
  audioContext: AudioContext | null;
  targetNodes: { name: string; param: AudioParam | null }[]; // List of target nodes (frequency, gain, other LFOs)
}

const LFO: React.FC<LFOProps> = ({ audioContext, targetNodes }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(5); // LFO frequency
  const [waveform, setWaveform] = useState<OscillatorType>("sine"); // LFO waveform
  const [depth, setDepth] = useState(50); // Modulation depth (amplitude)
  const [selectedTarget, setSelectedTarget] = useState<string>(""); // The selected modulation target

  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (audioContext) {
      // Create the LFO oscillator node
      lfoNodeRef.current = audioContext.createOscillator();
      gainNodeRef.current = audioContext.createGain();

      // Set the initial LFO properties
      lfoNodeRef.current.type = waveform;
      lfoNodeRef.current.frequency.value = frequency;
      gainNodeRef.current.gain.value = depth;

      // Connect the LFO to the GainNode (controls the amplitude of the modulation)
      lfoNodeRef.current.connect(gainNodeRef.current);

      if (isRunning) {
        lfoNodeRef.current.start();
      }
    }
  }, [audioContext, isRunning, waveform, frequency, depth]);

  const startLFO = () => {
    if (!isRunning && lfoNodeRef.current) {
      lfoNodeRef.current.start();
      setIsRunning(true);
    }
  };

  const stopLFO = () => {
    if (isRunning && lfoNodeRef.current) {
      lfoNodeRef.current.stop();
      lfoNodeRef.current.disconnect();
      setIsRunning(false);
    }
  };

  const handleTargetChange = (targetName: string) => {
    setSelectedTarget(targetName);

    // Disconnect the current target if any
    gainNodeRef.current?.disconnect();

    // Find the selected target and connect the LFO modulation
    const target = targetNodes.find((node) => node.name === targetName);
    if (target?.param) {
      gainNodeRef.current?.connect(target.param); // Apply LFO to the target AudioParam
    }
  };

  return (
    <div className="lfo p-4 border rounded-lg space-y-4">
      <h4>LFO</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label>Frequency</label>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
          <span>{frequency} Hz</span>
        </div>
        <div className="flex flex-col">
          <label>Waveform</label>
          <select
            value={waveform}
            onChange={(e) => setWaveform(e.target.value as OscillatorType)}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label>Depth</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
          />
          <span>{depth}%</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <label>Target</label>
        <select
          value={selectedTarget}
          onChange={(e) => handleTargetChange(e.target.value)}
        >
          {targetNodes.map((target) => (
            <option key={target.name} value={target.name}>
              {target.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={startLFO}
          className={`bg-green-500 text-white p-2 rounded ${
            isRunning ? "opacity-50" : ""
          }`}
          disabled={isRunning}
        >
          Start LFO
        </button>
        <button
          onClick={stopLFO}
          className={`bg-red-500 text-white p-2 rounded ${
            !isRunning ? "opacity-50" : ""
          }`}
          disabled={!isRunning}
        >
          Stop LFO
        </button>
      </div>
    </div>
  );
};

export default LFO;
