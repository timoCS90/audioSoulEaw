export interface SynthState {
  volume: number;
  osc1Frequency: number;
  osc2Frequency: number;
  osc3Frequency: number;
  osc1Detune: number;
  osc2Detune: number;
  osc3Detune: number;
  osc1Waveform: OscillatorType;
  osc2Waveform: OscillatorType;
  osc3Waveform: OscillatorType;
  lfo1Frequency: number;
  lfo2Frequency: number;
  lfo3Frequency: number;
  lfo1Depth: number;
  lfo2Depth: number;
  lfo3Depth: number;
  lfo1Target: string;
  lfo2Target: string;
  lfo3Target: string;
}

export const initialState: SynthState = {
  volume: 0.5,
  osc1Frequency: 440,
  osc2Frequency: 440,
  osc3Frequency: 440,
  osc1Detune: 0,
  osc2Detune: 0,
  osc3Detune: 0,
  osc1Waveform: "sine",
  osc2Waveform: "sine",
  osc3Waveform: "sine",
  lfo1Frequency: 1,
  lfo2Frequency: 1,
  lfo3Frequency: 1,
  lfo1Depth: 50,
  lfo2Depth: 50,
  lfo3Depth: 50,
  lfo1Target: "osc1Frequency",
  lfo2Target: "osc2Frequency",
  lfo3Target: "osc3Frequency",
};

type SynthAction =
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_OSC1_FREQUENCY"; payload: number }
  | { type: "SET_OSC2_FREQUENCY"; payload: number }
  | { type: "SET_OSC3_FREQUENCY"; payload: number }
  | { type: "SET_OSC1_DETUNE"; payload: number }
  | { type: "SET_OSC2_DETUNE"; payload: number }
  | { type: "SET_OSC3_DETUNE"; payload: number }
  | { type: "SET_OSC1_WAVEFORM"; payload: OscillatorType }
  | { type: "SET_OSC2_WAVEFORM"; payload: OscillatorType }
  | { type: "SET_OSC3_WAVEFORM"; payload: OscillatorType }
  | { type: "SET_LFO1_FREQUENCY"; payload: number }
  | { type: "SET_LFO2_FREQUENCY"; payload: number }
  | { type: "SET_LFO3_FREQUENCY"; payload: number }
  | { type: "SET_LFO1_DEPTH"; payload: number }
  | { type: "SET_LFO2_DEPTH"; payload: number }
  | { type: "SET_LFO3_DEPTH"; payload: number }
  | { type: "SET_LFO1_TARGET"; payload: string }
  | { type: "SET_LFO2_TARGET"; payload: string }
  | { type: "SET_LFO3_TARGET"; payload: string };

export const synthReducer = (
  state: SynthState,
  action: SynthAction
): SynthState => {
  switch (action.type) {
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_OSC1_FREQUENCY":
      return { ...state, osc1Frequency: action.payload };
    case "SET_OSC2_FREQUENCY":
      return { ...state, osc2Frequency: action.payload };
    case "SET_OSC3_FREQUENCY":
      return { ...state, osc3Frequency: action.payload };
    case "SET_OSC1_DETUNE":
      return { ...state, osc1Detune: action.payload };
    case "SET_OSC2_DETUNE":
      return { ...state, osc2Detune: action.payload };
    case "SET_OSC3_DETUNE":
      return { ...state, osc3Detune: action.payload };
    case "SET_OSC1_WAVEFORM":
      return { ...state, osc1Waveform: action.payload };
    case "SET_OSC2_WAVEFORM":
      return { ...state, osc2Waveform: action.payload };
    case "SET_OSC3_WAVEFORM":
      return { ...state, osc3Waveform: action.payload };
    case "SET_LFO1_FREQUENCY":
      return { ...state, lfo1Frequency: action.payload };
    case "SET_LFO2_FREQUENCY":
      return { ...state, lfo2Frequency: action.payload };
    case "SET_LFO3_FREQUENCY":
      return { ...state, lfo3Frequency: action.payload };
    case "SET_LFO1_DEPTH":
      return { ...state, lfo1Depth: action.payload };
    case "SET_LFO2_DEPTH":
      return { ...state, lfo2Depth: action.payload };
    case "SET_LFO3_DEPTH":
      return { ...state, lfo3Depth: action.payload };
    case "SET_LFO1_TARGET":
      return { ...state, lfo1Target: action.payload };
    case "SET_LFO2_TARGET":
      return { ...state, lfo2Target: action.payload };
    case "SET_LFO3_TARGET":
      return { ...state, lfo3Target: action.payload };
    default:
      return state;
  }
};
