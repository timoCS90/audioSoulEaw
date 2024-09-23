import React, { Component } from "react";
import Knob from "./Knob";

interface OscillatorProps {
  label: string;
  initialFrequency: number;
  initialDetune: number;
  initialWaveform: OscillatorType;
  onFrequencyChange: (frequency: number) => void;
  onDetuneChange: (detune: number) => void;
  onWaveformChange: (waveform: OscillatorType) => void;
}

interface OscillatorState {
  frequency: number;
  detune: number;
  waveform: OscillatorType;
}

class Oscillator extends Component<OscillatorProps, OscillatorState> {
  constructor(props: OscillatorProps) {
    super(props);
    this.state = {
      frequency: props.initialFrequency,
      detune: props.initialDetune,
      waveform: props.initialWaveform,
    };
  }

  handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = parseFloat(e.target.value);
    this.setState({ frequency });
    this.props.onFrequencyChange(frequency);
  };

  handleDetuneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const detune = parseFloat(e.target.value);
    this.setState({ detune });
    this.props.onDetuneChange(detune);
  };

  handleWaveformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const waveform = e.target.value as OscillatorType;
    this.setState({ waveform });
    this.props.onWaveformChange(waveform);
  };

  render() {
    return (
      <div className="oscillator">
        <h4>{this.props.label}</h4>
        <Knob
          label="Frequency"
          min={20}
          max={2000}
          step={1}
          value={this.state.frequency}
          onChange={this.handleFrequencyChange}
        />
        <Knob
          label="Detune"
          min={-50}
          max={50}
          step={1}
          value={this.state.detune}
          onChange={this.handleDetuneChange}
        />
        <label>
          Waveform
          <select
            value={this.state.waveform}
            onChange={this.handleWaveformChange}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="sawtooth">Sawtooth</option>
          </select>
        </label>
      </div>
    );
  }
}

export default Oscillator;
