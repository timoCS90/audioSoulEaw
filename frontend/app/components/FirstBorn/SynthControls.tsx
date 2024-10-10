// SynthControls.tsx
import React from "react";
import Slider from "./Slider";

interface ADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

interface SynthControlsProps {
  volume: number;
  oscFrequencies: number[];
  oscDetunes: number[];
  oscWaveforms: OscillatorType[];
  oscADSRs: ADSR[];
  lfoFrequencies: number[];
  lfoDepths: number[];
  lfoTargets: string[];
  startOscillator: (index: number) => void;
  stopOscillator: (index: number) => void;
  startLFO: (index: number) => void;
  stopLFO: (index: number) => void;
  setVolume: (value: number) => void;
  setOscFrequency: (index: number, value: number) => void;
  setOscDetune: (index: number, value: number) => void;
  setOscWaveform: (index: number, value: OscillatorType) => void;
  setOscADSR: (index: number, value: ADSR) => void;
  setLfoFrequency: (index: number, value: number) => void;
  setLfoDepth: (index: number, value: number) => void;
  setLfoTarget: (index: number, value: string) => void;
}

const SynthControls: React.FC<SynthControlsProps> = (props) => {
  const {
    volume,
    oscFrequencies,
    oscDetunes,
    oscWaveforms,
    oscADSRs,
    lfoFrequencies,
    lfoDepths,
    lfoTargets,
    startOscillator,
    stopOscillator,
    startLFO,
    stopLFO,
    setVolume,
    setOscFrequency,
    setOscDetune,
    setOscWaveform,
    setOscADSR,
    setLfoFrequency,
    setLfoDepth,
    setLfoTarget,
  } = props;

  // Helper function to render ADSR controls
  const renderADSRControls = (
    label: string,
    adsr: ADSR,
    setADSR: (value: ADSR) => void
  ) => (
    <div>
      <h4>{label} ADSR</h4>
      <Slider
        label="Attack"
        value={adsr.attack}
        min={0}
        max={5}
        step={0.01}
        onChange={(value) => setADSR({ ...adsr, attack: value })}
      />
      <Slider
        label="Decay"
        value={adsr.decay}
        min={0}
        max={5}
        step={0.01}
        onChange={(value) => setADSR({ ...adsr, decay: value })}
      />
      <Slider
        label="Sustain"
        value={adsr.sustain}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setADSR({ ...adsr, sustain: value })}
      />
      <Slider
        label="Release"
        value={adsr.release}
        min={0}
        max={5}
        step={0.01}
        onChange={(value) => setADSR({ ...adsr, release: value })}
      />
    </div>
  );

  return (
    <div>
      {/* Master Volume */}
      <Slider
        label="Master Volume"
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={setVolume}
      />

      {[0, 1, 2].map((index) => (
        <div key={index}>
          <h3>Oscillator {index + 1}</h3>
          <button onClick={() => startOscillator(index)}>
            Start Oscillator {index + 1}
          </button>
          <button onClick={() => stopOscillator(index)}>
            Stop Oscillator {index + 1}
          </button>
          <Slider
            label="Frequency"
            value={oscFrequencies[index]}
            min={20}
            max={20000}
            step={1}
            onChange={(value) => setOscFrequency(index, value)}
          />
          <Slider
            label="Detune"
            value={oscDetunes[index]}
            min={-100}
            max={100}
            step={1}
            onChange={(value) => setOscDetune(index, value)}
          />
          <select
            value={oscWaveforms[index]}
            onChange={(e) =>
              setOscWaveform(index, e.target.value as OscillatorType)
            }
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
          {renderADSRControls(
            `Oscillator ${index + 1}`,
            oscADSRs[index],
            (value) => setOscADSR(index, value)
          )}

          <h3>LFO {index + 1}</h3>
          <button onClick={() => startLFO(index)}>Start LFO {index + 1}</button>
          <button onClick={() => stopLFO(index)}>Stop LFO {index + 1}</button>
          <Slider
            label="LFO Frequency"
            value={lfoFrequencies[index]}
            min={0.1}
            max={20}
            step={0.1}
            onChange={(value) => setLfoFrequency(index, value)}
          />
          <Slider
            label="LFO Depth"
            value={lfoDepths[index]}
            min={0}
            max={100}
            step={1}
            onChange={(value) => setLfoDepth(index, value)}
          />
          <select
            value={lfoTargets[index]}
            onChange={(e) => setLfoTarget(index, e.target.value)}
          >
            <option value={`osc${index + 1}Frequency`}>
              Oscillator {index + 1} Frequency
            </option>
            <option value={`osc${index + 1}Detune`}>
              Oscillator {index + 1} Detune
            </option>
            {/* Add more options as needed */}
          </select>
        </div>
      ))}
    </div>
  );
};

export default SynthControls;
