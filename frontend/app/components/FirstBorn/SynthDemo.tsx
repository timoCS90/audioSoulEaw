// SynthDemo.tsx
import React, {
  useReducer,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import SynthControls from "./SynthControls";

// Define ADSR interface
interface ADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

type OscillatorType = "sine" | "square" | "sawtooth" | "triangle" | "custom";
type LfoTarget = string; // Define more precise types if needed

// Define the state interface
interface SynthState {
  volume: number;
  oscFrequencies: number[];
  oscDetunes: number[];
  oscWaveforms: OscillatorType[];
  oscADSRs: ADSR[];
  lfoFrequencies: number[];
  lfoDepths: number[];
  lfoTargets: LfoTarget[];
  midiAccess: MIDIAccess | null;
}

// Define the initial state
const initialState: SynthState = {
  volume: 0.5,
  oscFrequencies: [440, 440, 440],
  oscDetunes: [0, 0, 0],
  oscWaveforms: ["sine", "sine", "sine"],
  oscADSRs: [
    { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.5 },
    { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.5 },
    { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.5 },
  ],
  lfoFrequencies: [0.5, 0.5, 0.5],
  lfoDepths: [50, 50, 50],
  lfoTargets: ["osc1Frequency", "osc2Frequency", "osc3Frequency"],
  midiAccess: null,
};

// Define the action types
type SynthAction =
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_OSC_FREQUENCY"; payload: { index: number; value: number } }
  | { type: "SET_OSC_DETUNE"; payload: { index: number; value: number } }
  | {
      type: "SET_OSC_WAVEFORM";
      payload: { index: number; value: OscillatorType };
    }
  | { type: "SET_OSC_ADSR"; payload: { index: number; value: ADSR } }
  | { type: "SET_LFO_FREQUENCY"; payload: { index: number; value: number } }
  | { type: "SET_LFO_DEPTH"; payload: { index: number; value: number } }
  | { type: "SET_LFO_TARGET"; payload: { index: number; value: LfoTarget } }
  | { type: "SET_MIDI_ACCESS"; payload: MIDIAccess | null };

function synthReducer(state: SynthState, action: SynthAction): SynthState {
  switch (action.type) {
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_OSC_FREQUENCY": {
      const newFrequencies = [...state.oscFrequencies];
      newFrequencies[action.payload.index] = action.payload.value;
      return { ...state, oscFrequencies: newFrequencies };
    }
    case "SET_OSC_DETUNE": {
      const newDetunes = [...state.oscDetunes];
      newDetunes[action.payload.index] = action.payload.value;
      return { ...state, oscDetunes: newDetunes };
    }
    case "SET_OSC_WAVEFORM": {
      const newWaveforms = [...state.oscWaveforms];
      newWaveforms[action.payload.index] = action.payload.value;
      return { ...state, oscWaveforms: newWaveforms };
    }
    case "SET_OSC_ADSR": {
      const newADSRs = [...state.oscADSRs];
      newADSRs[action.payload.index] = action.payload.value;
      return { ...state, oscADSRs: newADSRs };
    }
    case "SET_LFO_FREQUENCY": {
      const newFrequencies = [...state.lfoFrequencies];
      newFrequencies[action.payload.index] = action.payload.value;
      return { ...state, lfoFrequencies: newFrequencies };
    }
    case "SET_LFO_DEPTH": {
      const newDepths = [...state.lfoDepths];
      newDepths[action.payload.index] = action.payload.value;
      return { ...state, lfoDepths: newDepths };
    }
    case "SET_LFO_TARGET": {
      const newTargets = [...state.lfoTargets];
      newTargets[action.payload.index] = action.payload.value;
      return { ...state, lfoTargets: newTargets };
    }
    case "SET_MIDI_ACCESS":
      return { ...state, midiAccess: action.payload };
    default:
      return state;
  }
}

const SynthDemo: React.FC = () => {
  const [state, dispatch] = useReducer(synthReducer, initialState);

  // Create AudioContext and nodes
  const audioContextRef = useRef<AudioContext | null>(null);

  // Oscillator references
  const oscRefs = useRef<Array<OscillatorNode | null>>([null, null, null]);
  const oscGainRefs = useRef<Array<GainNode | null>>([null, null, null]);

  // LFO references
  const lfoRefs = useRef<Array<OscillatorNode | null>>([null, null, null]);
  const lfoGainRefs = useRef<Array<GainNode | null>>([null, null, null]);

  // Initialize AudioContext when the user interacts
  const [isAudioInitialized, setAudioInitialized] = useState(false);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    audioContextRef.current.resume().then(() => {
      setAudioInitialized(true);
    });
  };

  const startOscillator = useCallback(
    (index: number) => {
      if (audioContextRef.current && !oscRefs.current[index]) {
        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        const adsr = state.oscADSRs[index];

        // Set oscillator parameters
        osc.type = state.oscWaveforms[index];
        osc.frequency.value = state.oscFrequencies[index];
        osc.detune.value = state.oscDetunes[index];

        // Apply ADSR envelope to gain node
        const now = audioContextRef.current.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + adsr.attack);
        gainNode.gain.linearRampToValueAtTime(
          adsr.sustain,
          now + adsr.attack + adsr.decay
        );

        osc.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        osc.start();

        oscRefs.current[index] = osc;
        oscGainRefs.current[index] = gainNode;
      }
    },
    [state.oscADSRs, state.oscWaveforms, state.oscFrequencies, state.oscDetunes]
  );

  // Stop individual oscillator
  const stopOscillator = useCallback(
    (index: number) => {
      const osc = oscRefs.current[index];
      const gainNode = oscGainRefs.current[index];
      if (osc && gainNode && audioContextRef.current) {
        const adsr = state.oscADSRs[index];
        const now = audioContextRef.current.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + adsr.release);

        osc.stop(now + adsr.release);
        oscRefs.current[index] = null;
        oscGainRefs.current[index] = null;
      }
    },
    [state.oscADSRs]
  );

  // Start individual LFO
  const startLFO = useCallback(
    (index: number) => {
      if (audioContextRef.current && !lfoRefs.current[index]) {
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();

        lfo.frequency.value = state.lfoFrequencies[index];
        lfoGain.gain.value = state.lfoDepths[index];

        lfo.connect(lfoGain);

        // Connect LFO to its target
        const target = state.lfoTargets[index];
        let targetParam: AudioParam | null = null;

        // Assuming target is something like 'osc1Frequency'
        if (target.startsWith("osc")) {
          const oscIndex = parseInt(target.charAt(3)) - 1; // 'osc1Frequency' => 0
          if (oscRefs.current[oscIndex]) {
            if (target.endsWith("Frequency")) {
              targetParam = oscRefs.current[oscIndex]!.frequency;
            } else if (target.endsWith("Detune")) {
              targetParam = oscRefs.current[oscIndex]!.detune;
            }
          }
        }

        if (targetParam) {
          lfoGain.connect(targetParam);
        }

        lfo.start();

        lfoRefs.current[index] = lfo;
        lfoGainRefs.current[index] = lfoGain;
      }
    },
    [state.lfoFrequencies, state.lfoDepths, state.lfoTargets, oscRefs]
  );

  // Stop individual LFO
  const stopLFO = useCallback((index: number) => {
    const lfo = lfoRefs.current[index];
    const lfoGain = lfoGainRefs.current[index];
    if (lfo && lfoGain) {
      lfo.stop();
      lfo.disconnect();
      lfoGain.disconnect();
      lfoRefs.current[index] = null;
      lfoGainRefs.current[index] = null;
    }
  }, []);

  // MIDI Support
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (access) => {
          dispatch({ type: "SET_MIDI_ACCESS", payload: access });
        },
        () => {
          console.warn("MIDI Access Denied");
        }
      );
    } else {
      console.warn("Web MIDI API not supported in this browser.");
    }
  }, []);

  // Handle MIDI Messages
  useEffect(() => {
    if (state.midiAccess) {
      const handleMIDIMessage = (event: MIDIMessageEvent) => {
        const data = event.data;
        if (data) {
          const [status, note, velocity] = data;
          const command = status & 0xf0;

          if (command === 0x90 && velocity > 0) {
            // Note On
            const frequency = 440 * Math.pow(2, (note - 69) / 12);
            dispatch({
              type: "SET_OSC_FREQUENCY",
              payload: { index: 0, value: frequency },
            });
            startOscillator(0);
          } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
            // Note Off
            stopOscillator(0);
          }
        }
      };

      // Add event listener to all MIDI inputs
      for (const input of state.midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
      }

      // Clean up on unmount
      return () => {
        for (const input of state.midiAccess!.inputs.values()) {
          input.onmidimessage = null;
        }
      };
    }
  }, [state.midiAccess, startOscillator, stopOscillator, dispatch]);

  // Start individual oscillator

  // Update oscillator parameters when state changes
  useEffect(() => {
    oscRefs.current.forEach((osc, index) => {
      if (osc) {
        osc.frequency.value = state.oscFrequencies[index];
        osc.detune.value = state.oscDetunes[index];
        osc.type = state.oscWaveforms[index];
      }
    });
  }, [state.oscFrequencies, state.oscDetunes, state.oscWaveforms]);

  // Update LFO parameters when state changes
  useEffect(() => {
    lfoRefs.current.forEach((lfo, index) => {
      if (lfo) {
        lfo.frequency.value = state.lfoFrequencies[index];
        if (lfoGainRefs.current[index]) {
          lfoGainRefs.current[index]!.gain.value = state.lfoDepths[index];
        }
      }
    });
  }, [state.lfoFrequencies, state.lfoDepths]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Synth Demo</h2>
      {!isAudioInitialized && (
        <div className="flex justify-center mb-6">
          <button
            onClick={initAudioContext}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Initialize Audio
          </button>
        </div>
      )}
      <SynthControls
        volume={state.volume}
        oscFrequencies={state.oscFrequencies}
        oscDetunes={state.oscDetunes}
        oscWaveforms={state.oscWaveforms}
        oscADSRs={state.oscADSRs}
        lfoFrequencies={state.lfoFrequencies}
        lfoDepths={state.lfoDepths}
        lfoTargets={state.lfoTargets}
        startOscillator={startOscillator}
        stopOscillator={stopOscillator}
        startLFO={startLFO}
        stopLFO={stopLFO}
        setVolume={(value) => dispatch({ type: "SET_VOLUME", payload: value })}
        setOscFrequency={(index, value) =>
          dispatch({ type: "SET_OSC_FREQUENCY", payload: { index, value } })
        }
        setOscDetune={(index, value) =>
          dispatch({ type: "SET_OSC_DETUNE", payload: { index, value } })
        }
        setOscWaveform={(index, value) =>
          dispatch({ type: "SET_OSC_WAVEFORM", payload: { index, value } })
        }
        setOscADSR={(index, value) =>
          dispatch({ type: "SET_OSC_ADSR", payload: { index, value } })
        }
        setLfoFrequency={(index, value) =>
          dispatch({ type: "SET_LFO_FREQUENCY", payload: { index, value } })
        }
        setLfoDepth={(index, value) =>
          dispatch({ type: "SET_LFO_DEPTH", payload: { index, value } })
        }
        setLfoTarget={(index, value) =>
          dispatch({ type: "SET_LFO_TARGET", payload: { index, value } })
        }
      />
    </div>
  );
};

export default SynthDemo;
