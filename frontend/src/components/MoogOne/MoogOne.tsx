"use client";
import React, { Component } from "react";
import Oscillator from "./Oscillator";
import Filter from "./Filter";
import Envelope from "./Envelope";
import "./moogone.css"; // Ensure you import the CSS file

class MoogOne extends Component {
  render() {
    return (
      <div className="moog-one">
        <div className="oscillators">
          <Oscillator
            label="Oscillator 1"
            initialFrequency={440}
            initialDetune={0}
            initialWaveform="sawtooth"
            onFrequencyChange={(freq) => console.log("Osc 1 Freq:", freq)}
            onDetuneChange={(detune) => console.log("Osc 1 Detune:", detune)}
            onWaveformChange={(waveform) =>
              console.log("Osc 1 Waveform:", waveform)
            }
          />
          <Oscillator
            label="Oscillator 2"
            initialFrequency={440}
            initialDetune={10}
            initialWaveform="square"
            onFrequencyChange={(freq) => console.log("Osc 2 Freq:", freq)}
            onDetuneChange={(detune) => console.log("Osc 2 Detune:", detune)}
            onWaveformChange={(waveform) =>
              console.log("Osc 2 Waveform:", waveform)
            }
          />
          <Oscillator
            label="Oscillator 3"
            initialFrequency={440}
            initialDetune={-10}
            initialWaveform="triangle"
            onFrequencyChange={(freq) => console.log("Osc 3 Freq:", freq)}
            onDetuneChange={(detune) => console.log("Osc 3 Detune:", detune)}
            onWaveformChange={(waveform) =>
              console.log("Osc 3 Waveform:", waveform)
            }
          />
        </div>

        <Filter
          onCutoffChange={(cutoff) => console.log("Filter Cutoff:", cutoff)}
          onResonanceChange={(resonance) =>
            console.log("Filter Resonance:", resonance)
          }
        />

        <Envelope
          onAttackChange={(attack) => console.log("Attack Change:", attack)}
          onDecayChange={(decay) => console.log("Decay Change:", decay)}
          onSustainChange={(sustain) => console.log("Sustain Change:", sustain)}
          onReleaseChange={(release) => console.log("Release Change:", release)}
        />
      </div>
    );
  }
}

export default MoogOne;
