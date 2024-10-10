"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { LockIcon, UnlockIcon } from "lucide-react";

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

interface DraggableSection {
  id: string;
  title: string;
  content: React.ReactNode;
  isVisible: boolean;
  position: { x: number; y: number };
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

export default function DraggableStepSequencer() {
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

  const [sections, setSections] = useState<DraggableSection[]>([
    {
      id: "sequencer",
      title: "Step Sequencer",
      content: null,
      isVisible: true,
      position: { x: 20, y: 20 },
    },
    {
      id: "kick",
      title: "Kick Controls",
      content: null,
      isVisible: true,
      position: { x: 20, y: 300 },
    },
    {
      id: "snare",
      title: "Snare Controls",
      content: null,
      isVisible: true,
      position: { x: 400, y: 20 },
    },
    {
      id: "hihat",
      title: "Hi-hat Controls",
      content: null,
      isVisible: true,
      position: { x: 400, y: 300 },
    },
    {
      id: "clap",
      title: "Clap Controls",
      content: null,
      isVisible: true,
      position: { x: 780, y: 20 },
    },
    {
      id: "midi",
      title: "MIDI Settings",
      content: null,
      isVisible: true,
      position: { x: 780, y: 300 },
    },
  ]);

  const [isAnchored, setIsAnchored] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
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

  const handleMIDIMessage = useCallback(
    (message: WebMidi.MIDIMessageEvent) => {
      const [status, note, velocity] = message.data;
      if (status === 144 && velocity > 0) {
        // Note On
        const trackIndex = notes.findIndex((n) => n.midiNote === note);
        if (trackIndex !== -1) {
          toggleStep(trackIndex, currentStep);
        }
      }
    },
    [notes, currentStep]
  );

  useEffect(() => {
    if (midiInput) {
      midiInput.onmidimessage = handleMIDIMessage;
    }
    return () => {
      if (midiInput) {
        midiInput.onmidimessage = null;
      }
    };
  }, [midiInput, handleMIDIMessage]);

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
    setCurrentStep((prevStep) => (prevStep + 1) % NUM_STEPS);
  }, [sequence, currentStep, playNote]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPlaying) {
      intervalId = setInterval(scheduleNotes, (60 / tempo / 4) * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, tempo, scheduleNotes]);

  const toggleStep = useCallback((trackIndex: number, stepIndex: number) => {
    setSequence((prevSequence) =>
      prevSequence.map((track, i) =>
        i === trackIndex
          ? track.map((step, j) => (j === stepIndex ? !step : step))
          : track
      )
    );
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
    setCurrentStep(0);
  }, []);

  const updateNote = useCallback(
    (trackIndex: number, updates: Partial<Note>) => {
      setNotes((prevNotes) =>
        prevNotes.map((note, i) =>
          i === trackIndex ? { ...note, ...updates } : note
        )
      );
    },
    []
  );

  const toggleSectionVisibility = useCallback((id: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, isVisible: !section.isVisible }
          : section
      )
    );
  }, []);

  const updateSectionPosition = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === id ? { ...section, position: newPosition } : section
        )
      );
    },
    []
  );

  const toggleAnchor = () => {
    setIsAnchored((prev) => !prev);
  };

  const saveState = useCallback(() => {
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
  }, [sequence, notes, tempo]);

  const loadState = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const state: SequencerState = JSON.parse(
              e.target?.result as string
            );
            setSequence(state.sequence);
            setNotes(state.notes);
            setTempo(state.tempo);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const renderControls = (noteIndex: number) => {
    const note = notes[noteIndex];
    return (
      <div className="space-y-1 text-xs">
        {/* Kontrollen für ADSR, Volume, etc. */}
        <div className="flex items-center">
          <span className="w-8">Freq:</span>
          <input
            type="range"
            min="20"
            max="2000"
            value={note.baseFreq}
            onChange={(e) =>
              updateNote(noteIndex, { baseFreq: Number(e.target.value) })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.baseFreq}</span>
        </div>
        <div className="flex items-center">
          <span className="w-8">Vol:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={note.volume}
            onChange={(e) =>
              updateNote(noteIndex, { volume: Number(e.target.value) })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.volume.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <span className="w-8">Atk:</span>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={note.adsr.attack}
            onChange={(e) =>
              updateNote(noteIndex, {
                adsr: { ...note.adsr, attack: Number(e.target.value) },
              })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.adsr.attack.toFixed(2)}</span>
        </div>
        <div className="flex items-center">
          <span className="w-8">Dec:</span>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={note.adsr.decay}
            onChange={(e) =>
              updateNote(noteIndex, {
                adsr: { ...note.adsr, decay: Number(e.target.value) },
              })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.adsr.decay.toFixed(2)}</span>
        </div>
        <div className="flex items-center">
          <span className="w-8">Sus:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={note.adsr.sustain}
            onChange={(e) =>
              updateNote(noteIndex, {
                adsr: { ...note.adsr, sustain: Number(e.target.value) },
              })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.adsr.sustain.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <span className="w-8">Rel:</span>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={note.adsr.release}
            onChange={(e) =>
              updateNote(noteIndex, {
                adsr: { ...note.adsr, release: Number(e.target.value) },
              })
            }
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{note.adsr.release.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    >
      <h1 className="text-xl font-bold mb-2 text-center bg-clip-text bg-gradient-to-t from-slate-300 to-slate-800">
        Midi Fm StepSequencer
      </h1>

      <button
        onClick={toggleAnchor}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg"
        aria-label={isAnchored ? "Unlock components" : "Lock components"}
      >
        {isAnchored ? <LockIcon size={20} /> : <UnlockIcon size={20} />}
      </button>

      {sections.map((section) => (
        <motion.div
          key={section.id}
          drag={!isAnchored}
          dragMomentum={false}
          dragConstraints={containerRef}
          onDragEnd={(event, info) => {
            // Aktualisieren der Position relativ zum Container
            const containerRect = containerRef.current!.getBoundingClientRect();
            updateSectionPosition(section.id, {
              x: info.point.x - containerRect.left - 40, // Anpassung für Padding/Margin
              y: info.point.y - containerRect.top - 40,
            });
          }}
          initial={{ x: section.position.x, y: section.position.y }}
          // Entfernen des animate-Props, um unerwünschte Animationen zu vermeiden
          style={{ x: section.position.x, y: section.position.y }}
          className="absolute bg-gray-800 p-4 rounded-lg shadow-lg text-xs w-min pt-8 px-6 pb-6 cursor-grab shadow-teal-500 opacity-80"
          whileDrag={{ cursor: "grabbing" }}
          transition={{ type: "tween", duration: 0 }} // Minimale Animationen
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-semibold text-purple-300">
              {section.title}
            </h2>
            <button
              onClick={() => toggleSectionVisibility(section.id)}
              className="px-1 py-0.5 bg-purple-500 hover:bg-purple-600 rounded-md text-white text-xs"
              aria-label={
                section.isVisible
                  ? `Hide ${section.title}`
                  : `Show ${section.title}`
              }
            >
              {section.isVisible ? "Hide" : "Show"}
            </button>
          </div>
          {section.isVisible && (
            <div>
              {section.id === "sequencer" && (
                <>
                  <div className="mb-2 flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlayPause}
                      className={`px-2 py-1 rounded-full font-semibold text-xs ${
                        isPlaying
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } transition-colors duration-200 shadow-lg`}
                    >
                      {isPlaying ? "Stop" : "Play"}
                    </motion.button>
                    <div className="flex items-center space-x-1">
                      <label className="text-xs">Tempo: {tempo}</label>
                      <input
                        type="range"
                        min="60"
                        max="240"
                        value={tempo}
                        onChange={(e) => setTempo(Number(e.target.value))}
                        className="w-16 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-0.5 bg-gray-700 p-1 rounded-lg">
                    <div className="col-span-1"></div>
                    {Array(NUM_STEPS)
                      .fill(0)
                      .map((_, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="text-center text-[0.5rem] font-medium text-gray-400"
                        >
                          {stepIndex + 1}
                        </div>
                      ))}
                    {sequence.map((track, trackIndex) => (
                      <React.Fragment key={trackIndex}>
                        <div className="flex items-center justify-end pr-0.5 font-medium text-[0.5rem] text-gray-300">
                          {notes[trackIndex].name}
                        </div>
                        {track.map((isActive, stepIndex) => (
                          <motion.button
                            key={stepIndex}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleStep(trackIndex, stepIndex)}
                            className={`w-full aspect-square rounded-sm ${
                              isActive ? "bg-purple-500" : "bg-gray-600"
                            } ${
                              currentStep === stepIndex && isPlaying
                                ? "ring-1 ring-yellow-400"
                                : ""
                            } transition-colors duration-150 ease-in-out`}
                            aria-label={`Toggle step ${stepIndex + 1} for ${
                              notes[trackIndex].name
                            }`}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
              {["kick", "snare", "hihat", "clap"].includes(section.id) &&
                (() => {
                  const indexMap: { [key: string]: number } = {
                    kick: 0,
                    snare: 1,
                    hihat: 2,
                    clap: 3,
                  };
                  return renderControls(indexMap[section.id]);
                })()}
              {section.id === "midi" && (
                <>
                  <div className="space-y-1">
                    <div>
                      <label className="block text-[0.6rem] font-medium mb-0.5 text-gray-300">
                        MIDI Input
                      </label>
                      <select
                        value={midiInput?.id || ""}
                        onChange={(e) =>
                          setMidiInput(
                            midiInputs.find(
                              (input) => input.id === e.target.value
                            ) || null
                          )
                        }
                        className="w-full bg-gray-700 text-white rounded-md p-0.5 text-[0.6rem]"
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
                      <label className="block text-[0.6rem] font-medium mb-0.5 text-gray-300">
                        MIDI Output
                      </label>
                      <select
                        value={midiOutput?.id || ""}
                        onChange={(e) =>
                          setMidiOutput(
                            midiOutputs.find(
                              (output) => output.id === e.target.value
                            ) || null
                          )
                        }
                        className="w-full bg-gray-700 text-white rounded-md p-0.5 text-[0.6rem]"
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
                  <div className="mt-2 flex justify-center space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveState}
                      className="px-2 py-0.5 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold text-white text-[0.6rem] shadow-lg transition-colors duration-200"
                    >
                      Save
                    </motion.button>
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-0.5 bg-green-500 hover:bg-green-600 rounded-full font-semibold text-white text-[0.6rem] shadow-lg transition-colors duration-200 cursor-pointer"
                    >
                      Load
                      <input
                        type="file"
                        onChange={loadState}
                        className="hidden"
                        accept=".json"
                      />
                    </motion.label>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
