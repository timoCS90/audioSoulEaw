import React, { Component } from "react";
import Knob from "./Knob";

// Define the FilterProps interface with the correct function types
interface FilterProps {
  onCutoffChange: (cutoff: number) => void;
  onResonanceChange: (resonance: number) => void;
}

interface FilterState {
  cutoff: number;
  resonance: number;
}

class Filter extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      cutoff: 1000,
      resonance: 1,
    };
  }

  handleCutoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cutoff = parseFloat(e.target.value);
    this.setState({ cutoff });
    this.props.onCutoffChange(cutoff); // Correctly invoke the passed down prop
  };

  handleResonanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const resonance = parseFloat(e.target.value);
    this.setState({ resonance });
    this.props.onResonanceChange(resonance); // Correctly invoke the passed down prop
  };

  render() {
    return (
      <div className="filter">
        <h3>Filter</h3>
        <Knob
          label="Cutoff"
          min={20}
          max={20000}
          step={1}
          value={this.state.cutoff}
          onChange={this.handleCutoffChange}
        />
        <Knob
          label="Resonance"
          min={0}
          max={10}
          step={0.1}
          value={this.state.resonance}
          onChange={this.handleResonanceChange}
        />
      </div>
    );
  }
}

export default Filter;
