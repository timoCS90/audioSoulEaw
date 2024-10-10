"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const NUM_STEPS = 16;
const NUM_TRACKS = 4;

interface Note {
  name: string;
  baseFreq: number;
  adsr: ADSR;
  modulation: Modulation;
  volume: number;
  midiNote: number;
}

interface ADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

interface Modulation {
  frequency: number;
  amount: number;
}

interface SequencerState {
  sequence: boolean[][];
  notes: Note[];
  tempo: number;
}

const INITIAL_NOTES: Note[] = [
  {
    name: "Kick",
    baseFreq: 100,
    adsr: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1 },
    modulation: { frequency: 0, amount: 0 },
    volume: 0.8,
    midiNote: 36,
  },
  {
    name: "Snare",
    baseFreq: 250,
    adsr: { attack: 0.01, decay: 0.05, sustain: 0.2, release: 0.1 },
    modulation: { frequency: 0, amount: 0 },
    volume: 0.7,
    midiNote: 38,
  },
  {
    name: "Hi-hat",
    baseFreq: 1000,
    adsr: { attack: 0.01, decay: 0.05, sustain: 0.1, release: 0.1 },
    modulation: { frequency: 0, amount: 0 },
    volume: 0.6,
    midiNote: 42,
  },
  {
    name: "Clap",
    baseFreq: 1500,
    adsr: { attack: 0.01, decay: 0.05, sustain: 0.1, release: 0.1 },
    modulation: { frequency: 0, amount: 0 },
    volume: 0.6,
    midiNote: 39,
  },
];

export default function MIDIEnhancedStepSequencer() {
  const [sequence, setSequence] = useState<boolean[][]>(
    Array(NUM_TRACKS).fill(Array(NUM_STEPS).fill(false))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [midiInput, setMidiInput] = useState<WebMidi.MIDIInput | null>(null);
  const [midiOutput, setMidiOutput] = useState<WebMidi.MIDIOutput | null>(null);
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [midiOutputs, setMidiOutputs] = useState<WebMidi.MIDIOutput[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext)();
    initMIDI();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initMIDI = async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      const inputs = Array.from(midiAccess.inputs.values());
      const outputs = Array.from(midiAccess.outputs.values());
      setMidiInputs(inputs);
      setMidiOutputs(outputs);
      if (inputs.length > 0) setMidiInput(inputs[0]);
      if (outputs.length > 0) setMidiOutput(outputs[0]);
    } catch (err) {
      console.error("MIDI access denied:", err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [status, note, velocity] = message.data;
    if (status === 144 && velocity > 0) {
      // Note On
      const trackIndex = notes.findIndex((n) => n.midiNote === note);
      if (trackIndex !== -1) {
        toggleStep(trackIndex, currentStep);
      }
    }
  };

  useEffect(() => {
    if (midiInput) {
      midiInput.onmidimessage = handleMIDIMessage;
    }
    return () => {
      if (midiInput) {
        midiInput.onmidimessage = null;
      }
    };
  }, [handleMIDIMessage, midiInput, sequence]);

  const playNote = useCallback(
    (trackIndex: number) => {
      if (!audioContextRef.current) return;

      const { baseFreq, adsr, modulation, volume, midiNote } =
        notes[trackIndex];
      const ctx = audioContextRef.current;
      const t = ctx.currentTime;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const modulationOsc = ctx.createOscillator();
      const modulationGain = ctx.createGain();

      oscillator.frequency.setValueAtTime(baseFreq, t);
      oscillator.connect(gainNode);

      modulationOsc.frequency.setValueAtTime(modulation.frequency, t);
      modulationOsc.connect(modulationGain);
      modulationGain.gain.setValueAtTime(modulation.amount * baseFreq, t);
      modulationGain.connect(oscillator.frequency);

      gainNode.connect(ctx.destination);

      // ADSR envelope
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(volume, t + adsr.attack);
      gainNode.gain.linearRampToValueAtTime(
        adsr.sustain * volume,
        t + adsr.attack + adsr.decay
      );
      gainNode.gain.setValueAtTime(
        adsr.sustain * volume,
        t + adsr.attack + adsr.decay + adsr.sustain
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        t + adsr.attack + adsr.decay + adsr.sustain + adsr.release
      );

      oscillator.start(t);
      modulationOsc.start(t);
      oscillator.stop(
        t + adsr.attack + adsr.decay + adsr.sustain + adsr.release
      );
      modulationOsc.stop(
        t + adsr.attack + adsr.decay + adsr.sustain + adsr.release
      );

      // Send MIDI note
      if (midiOutput) {
        midiOutput.send([0x90, midiNote, 0x7f]); // Note On
        setTimeout(() => {
          midiOutput.send([0x80, midiNote, 0x00]); // Note Off
        }, (adsr.attack + adsr.decay + adsr.sustain + adsr.release) * 1000);
      }
    },
    [notes, midiOutput]
  );

  const scheduleNotes = useCallback(() => {
    sequence.forEach((track, trackIndex) => {
      if (track[currentStep]) {
        playNote(trackIndex);
      }
    });
    setCurrentStep((currentStep + 1) % NUM_STEPS);
  }, [sequence, currentStep, playNote]);

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(scheduleNotes, (60 / tempo / 4) * 1000);
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, tempo, scheduleNotes]);

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    setSequence(
      sequence.map((track, i) =>
        i === trackIndex
          ? track.map((step, j) => (j === stepIndex ? !step : step))
          : track
      )
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setCurrentStep(0);
  };

  const updateNote = (trackIndex: number, updates: Partial<Note>) => {
    setNotes(
      notes.map((note, i) =>
        i === trackIndex ? { ...note, ...updates } : note
      )
    );
  };

  const saveState = () => {
    const state: SequencerState = {
      sequence,
      notes,
      tempo,
    };
    const stateString = JSON.stringify(state);
    const blob = new Blob([stateString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sequencer-state.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const state: SequencerState = JSON.parse(e.target?.result as string);
          setSequence(state.sequence);
          setNotes(state.notes);
          setTempo(state.tempo);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl text-white">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        MIDI Enhanced Step Sequencer
      </h1>
      <div className="mb-8 flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className={`px-8 py-3 rounded-full font-semibold text-lg ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } transition-colors duration-200 shadow-lg`}
        >
          {isPlaying ? "Stop" : "Play"}
        </motion.button>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Tempo: {tempo} BPM</label>
          <input
            type="range"
            min="60"
            max="240"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="mb-8 grid grid-cols-[auto_repeat(16,1fr)] gap-1 bg-gray-800 p-4 rounded-lg shadow-inner">
        <div className="col-span-1"></div>
        {Array(NUM_STEPS)
          .fill(0)
          .map((_, stepIndex) => (
            <div
              key={stepIndex}
              className="text-center text-xs font-medium text-gray-400"
            >
              {stepIndex + 1}
            </div>
          ))}
        {sequence.map((track, trackIndex) => (
          <React.Fragment key={trackIndex}>
            <div className="flex items-center justify-end pr-2 font-medium text-gray-300">
              {notes[trackIndex].name}
            </div>
            {track.map((isActive, stepIndex) => (
              <motion.button
                key={stepIndex}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleStep(trackIndex, stepIndex)}
                className={`w-full aspect-square rounded-md ${
                  isActive ? "bg-purple-500" : "bg-gray-700"
                } ${
                  currentStep === stepIndex && isPlaying
                    ? "ring-2 ring-yellow-400"
                    : ""
                } transition-colors duration-150 ease-in-out`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="space-y-8">
        {notes.map((note, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">
              {note.name} Controls
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Base Frequency
                </label>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  value={note.baseFreq}
                  onChange={(e) =>
                    updateNote(index, { baseFreq: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.baseFreq} Hz
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={note.volume}
                  onChange={(e) =>
                    updateNote(index, { volume: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.volume.toFixed(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Attack
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={note.adsr.attack}
                  onChange={(e) =>
                    updateNote(index, {
                      adsr: { ...note.adsr, attack: Number(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.adsr.attack.toFixed(2)} s
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Decay
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={note.adsr.decay}
                  onChange={(e) =>
                    updateNote(index, {
                      adsr: { ...note.adsr, decay: Number(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.adsr.decay.toFixed(2)} s
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Sustain
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={note.adsr.sustain}
                  onChange={(e) =>
                    updateNote(index, {
                      adsr: { ...note.adsr, sustain: Number(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.adsr.sustain.toFixed(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Release
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={note.adsr.release}
                  onChange={(e) =>
                    updateNote(index, {
                      adsr: { ...note.adsr, release: Number(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.adsr.release.toFixed(2)} s
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Modulation Frequency
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={note.modulation.frequency}
                  onChange={(e) =>
                    updateNote(index, {
                      modulation: {
                        ...note.modulation,
                        frequency: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.modulation.frequency} Hz
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Modulation Amount
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={note.modulation.amount}
                  onChange={(e) =>
                    updateNote(index, {
                      modulation: {
                        ...note.modulation,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {note.modulation.amount.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">
          MIDI Settings
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              MIDI Input
            </label>
            <select
              value={midiInput?.id || ""}
              onChange={(e) =>
                setMidiInput(
                  midiInputs.find((input) => input.id === e.target.value) ||
                    null
                )
              }
              className="w-full bg-gray-700 text-white rounded-md p-2"
            >
              <option value="">Select MIDI Input</option>
              {midiInputs.map((input) => (
                <option key={input.id} value={input.id}>
                  {input.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              MIDI Output
            </label>
            <select
              value={midiOutput?.id || ""}
              onChange={(e) =>
                setMidiOutput(
                  midiOutputs.find((output) => output.id === e.target.value) ||
                    null
                )
              }
              className="w-full bg-gray-700 text-white rounded-md p-2"
            >
              <option value="">Select MIDI Output</option>
              {midiOutputs.map((output) => (
                <option key={output.id} value={output.id}>
                  {output.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveState}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold text-white shadow-lg transition-colors duration-200"
        >
          Save State
        </motion.button>
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-full font-semibold text-white shadow-lg transition-colors duration-200 cursor-pointer"
        >
          Load State
          <input
            type="file"
            onChange={loadState}
            className="hidden"
            accept=".json"
          />
        </motion.label>
      </div>
    </div>
  );
}
