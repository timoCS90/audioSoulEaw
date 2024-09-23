import React, { Component } from "react";
import Knob from "./Knob";

interface EnvelopeProps {
  onAttackChange: (attack: number) => void;
  onDecayChange: (decay: number) => void;
  onSustainChange: (sustain: number) => void;
  onReleaseChange: (release: number) => void;
}

interface EnvelopeState {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

class Envelope extends Component<EnvelopeProps, EnvelopeState> {
  constructor(props: EnvelopeProps) {
    super(props);
    this.state = {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.3,
    };
  }

  handleAttackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const attack = parseFloat(e.target.value);
    this.setState({ attack });
    this.props.onAttackChange(attack);
  };

  handleDecayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const decay = parseFloat(e.target.value);
    this.setState({ decay });
    this.props.onDecayChange(decay);
  };

  handleSustainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sustain = parseFloat(e.target.value);
    this.setState({ sustain });
    this.props.onSustainChange(sustain);
  };

  handleReleaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const release = parseFloat(e.target.value);
    this.setState({ release });
    this.props.onReleaseChange(release);
  };

  render() {
    return (
      <div className="envelope">
        <h3>Envelope</h3>
        <Knob
          label="Attack"
          min={0}
          max={5}
          step={0.1}
          value={this.state.attack}
          onChange={this.handleAttackChange}
        />
        <Knob
          label="Decay"
          min={0}
          max={5}
          step={0.1}
          value={this.state.decay}
          onChange={this.handleDecayChange}
        />
        <Knob
          label="Sustain"
          min={0}
          max={1}
          step={0.01}
          value={this.state.sustain}
          onChange={this.handleSustainChange}
        />
        <Knob
          label="Release"
          min={0}
          max={5}
          step={0.1}
          value={this.state.release}
          onChange={this.handleReleaseChange}
        />
      </div>
    );
  }
}

export default Envelope;
