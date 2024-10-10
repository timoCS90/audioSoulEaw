"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Volume2, Save } from "lucide-react";

const steps = 16;
const defaultInstruments = [
  { name: "Kick", color: "#FF6B6B", sample: "/samples/kick.wav", volume: 1 },
  { name: "Snare", color: "#4ECDC4", sample: "/samples/snare.wav", volume: 1 },
  { name: "Hi-hat", color: "#45B7D1", sample: "/samples/hihat.wav", volume: 1 },
  { name: "Tom", color: "#F7B731", sample: "/samples/tom.wav", volume: 1 },
  { name: "Clap", color: "#5D5FEF", sample: "/samples/clap.wav", volume: 1 },
  {
    name: "Cowbell",
    color: "#FF9FF3",
    sample: "/samples/cowbell.wav",
    volume: 1,
  },
];

const genrePatterns = {
  techno: {
    Kick: [
      0.9, 0.1, 0.2, 0.1, 0.8, 0.1, 0.2, 0.1, 0.9, 0.1, 0.2, 0.1, 0.8, 0.1, 0.2,
      0.1,
    ],
    Snare: [
      0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8,
      0.1,
    ],
    "Hi-hat": [
      0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8,
      0.6,
    ],
    Tom: [
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3,
      0.3,
    ],
    Clap: [
      0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.8,
      0.1,
    ],
    Cowbell: [
      0.1, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1,
      0.1,
    ],
  },
  hiphop: {
    Kick: [
      0.9, 0.1, 0.2, 0.1, 0.8, 0.1, 0.2, 0.1, 0.9, 0.1, 0.2, 0.1, 0.8, 0.1, 0.2,
      0.1,
    ],
    Snare: [
      0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1,
      0.1,
    ],
    "Hi-hat": [
      0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8,
      0.6,
    ],
    Tom: [
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3,
      0.3,
    ],
    Clap: [
      0.1, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1,
      0.1,
    ],
    Cowbell: [
      0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.3,
      0.1,
    ],
  },
  house: {
    Kick: [
      0.9, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1,
      0.1,
    ],
    Snare: [
      0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1,
      0.1,
    ],
    "Hi-hat": [
      0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
      0.8,
    ],
    Tom: [
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3,
      0.3,
    ],
    Clap: [
      0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1,
      0.1,
    ],
    Cowbell: [
      0.1, 0.3, 0.1, 0.3, 0.1, 0.3, 0.1, 0.3, 0.1, 0.3, 0.1, 0.3, 0.1, 0.3, 0.1,
      0.3,
    ],
  },
};

const EnhancedAudioStepSequencer = () => {
  const [instruments, setInstruments] = useState(defaultInstruments);
  const [sequence, setSequence] = useState(
    instruments.map(() => Array(steps).fill(false))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [swing, setSwing] = useState(0);
  const [presets, setPresets] = useState<
    { name: string; pattern: boolean[][] }[]
  >([]);
  const [sampleSource, setSampleSource] = useState<"local" | "mongodb">(
    "local"
  );
  const [sampleLibrary, setSampleLibrary] = useState<
    { name: string; url: string }[]
  >([]);
  const [isSampleMenuOpen, setIsSampleMenuOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<number | null>(
    null
  );
  const [selectedGenre, setSelectedGenre] = useState<
    "techno" | "hiphop" | "house"
  >("techno");

  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sampleBuffers = useRef<{ [key: string]: AudioBuffer }>({});

  const loadSamples = async () => {
    for (const instrument of instruments) {
      const url =
        sampleSource === "local"
          ? instrument.sample
          : `/api/samples/${instrument.name.toLowerCase()}`;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(
          arrayBuffer
        );
        sampleBuffers.current[instrument.name] = audioBuffer;
      } catch (error) {
        console.error(
          `Fehler beim Laden des Samples für ${instrument.name}:`,
          error
        );
      }
    }
  };

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    loadSamples();
    fetchPresets();
    fetchSampleLibrary();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [loadSamples]);

  useEffect(() => {
    loadSamples();
  }, [sampleSource, instruments]);

  const fetchPresets = async () => {
    try {
      const response = await fetch("/api/presets");
      const data = await response.json();
      setPresets(data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Presets:", error);
    }
  };

  const fetchSampleLibrary = async () => {
    try {
      const response = await fetch("/api/sample-library");
      const data = await response.json();
      setSampleLibrary(data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Sample-Bibliothek:", error);
    }
  };

  const toggleStep = (instrumentIndex: number, stepIndex: number) => {
    const newSequence = [...sequence];
    newSequence[instrumentIndex][stepIndex] =
      !newSequence[instrumentIndex][stepIndex];
    setSequence(newSequence);
  };

  const updateInstrumentVolume = (instrumentIndex: number, volume: number) => {
    const newInstruments = [...instruments];
    newInstruments[instrumentIndex].volume = volume;
    setInstruments(newInstruments);
  };

  const playSequence = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentStep(0);
    setIsPlaying(true);
    const stepTime = ((60 / bpm) * 1000) / 4;

    const playStep = (step: number) => {
      playStepAudio(step);
      setCurrentStep(step);

      const nextStep = (step + 1) % steps;
      const swingDelay = step % 2 === 1 ? (swing / 100) * stepTime : 0;
      setTimeout(() => playStep(nextStep), stepTime + swingDelay);
    };

    playStep(0);
  };

  const stopSequence = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const playStepAudio = (step: number) => {
    if (!audioContextRef.current) return;

    sequence.forEach((track, index) => {
      if (track[step]) {
        if (!audioContextRef.current) return;
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();

        source.buffer = sampleBuffers.current[instruments[index].name];
        const instrumentVolume = instruments[index].volume;
        gainNode.gain.setValueAtTime(
          masterVolume * instrumentVolume,
          audioContextRef.current.currentTime
        );

        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        source.start();
      }
    });
  };

  const openSampleMenu = (instrumentIndex: number) => {
    setSelectedInstrument(instrumentIndex);
    setIsSampleMenuOpen(true);
  };

  const closeSampleMenu = () => {
    setSelectedInstrument(null);
    setIsSampleMenuOpen(false);
  };

  const changeSample = async (newSample: string) => {
    if (selectedInstrument === null) return;

    const newInstruments = [...instruments];
    newInstruments[selectedInstrument].sample = newSample;
    setInstruments(newInstruments);

    try {
      const response = await fetch(newSample);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(
        arrayBuffer
      );
      sampleBuffers.current[instruments[selectedInstrument].name] = audioBuffer;
    } catch (error) {
      console.error(`Fehler beim Laden des neuen Samples:`, error);
    }

    closeSampleMenu();
  };

  const generateAutogroove = () => {
    const newSequence = instruments.map((instrument) => {
      return Array(steps)
        .fill(false)
        .map((_, stepIndex) => {
          const probability =
            genrePatterns[selectedGenre][
              instrument.name as keyof (typeof genrePatterns)["techno"]
            ][stepIndex];
          return Math.random() < probability;
        });
    });
    setSequence(newSequence);
  };

  const saveAsPreset = () => {
    const presetName = prompt("Geben Sie einen Namen für das Preset ein:");
    if (presetName) {
      const newPreset = { name: presetName, pattern: sequence };
      setPresets([...presets, newPreset]);
      // Hier würden Sie normalerweise das neue Preset auch an Ihren Server senden
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const Step = ({
    active,
    isCurrentStep,
    onClick,
    color,
  }: {
    active: boolean;
    isCurrentStep: boolean;
    onClick: () => void;
    color: string;
  }) => (
    <motion.div
      className={`w-8 h-8 rounded-md cursor-pointer relative ${
        active ? "bg-opacity-100" : "bg-opacity-30"
      }`}
      style={{ backgroundColor: active ? color : "#2D3748" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {isCurrentStep && (
        <div className="absolute inset-0 border-2 border-white rounded-md"></div>
      )}
    </motion.div>
  );

  const Preset = ({
    name,
    pattern,
  }: {
    name: string;
    pattern: boolean[][];
  }) => (
    <motion.button
      className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setSequence(pattern)}
    >
      {name}
    </motion.button>
  );

  return (
    <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Erweiterter Audio-Stepsequenzer
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-white">BPM:</span>
            <input
              type="number"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-gray-700 text-white rounded-md"
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-white">Swing:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={swing}
              onChange={(e) => setSwing(Number(e.target.value))}
              className="w-24"
            />
            <span className="ml-2 text-white">{swing}%</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-white">Lautstärke:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <select
            value={sampleSource}
            onChange={(e) =>
              setSampleSource(e.target.value as "local" | "mongodb")
            }
            className="px-2 py-1 bg-gray-700 text-white rounded-md"
          >
            <option value="local">Lokale Samples</option>
            <option value="mongodb">MongoDB Samples</option>
          </select>
          <motion.button
            className={`px-4 py-2 rounded-md font-medium ${
              isPlaying ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? stopSequence : playSequence}
          >
            {isPlaying ? "Stop" : "Abspielen"}
          </motion.button>
        </div>
      </div>
      <div className="mb-8 bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <div className="min-w-max">
          {sequence.map((track, instrumentIndex) => (
            <div
              key={instrumentIndex}
              className="flex items-center mb-4 last:mb-0"
            >
              <div className="w-40 mr-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {instruments[instrumentIndex].name}
                </span>
                <div className="flex items-center">
                  <Volume2 size={16} className="text-white mr-1" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={instruments[instrumentIndex].volume}
                    onChange={(e) =>
                      updateInstrumentVolume(
                        instrumentIndex,
                        Number(e.target.value)
                      )
                    }
                    className="w-16"
                  />
                </div>
                <motion.button
                  className="p-1 bg-gray-700 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openSampleMenu(instrumentIndex)}
                >
                  <Music size={16} className="text-white" />
                </motion.button>
              </div>
              <div className="flex space-x-2">
                {track.map((on, stepIndex) => (
                  <Step
                    key={stepIndex}
                    active={on}
                    isCurrentStep={isPlaying && stepIndex === currentStep}
                    onClick={() => toggleStep(instrumentIndex, stepIndex)}
                    color={instruments[instrumentIndex].color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Autogroove</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedGenre}
            onChange={(e) =>
              setSelectedGenre(e.target.value as "techno" | "hiphop" | "house")
            }
            className="px-2 py-1 bg-gray-700 text-white rounded-md"
          >
            <option value="techno">Techno</option>
            <option value="hiphop">Hip Hop</option>
            <option value="house">House</option>
          </select>
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateAutogroove}
          >
            Generieren
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveAsPreset}
          >
            <Save size={16} className="inline mr-2" />
            Als Preset speichern
          </motion.button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Presets</h3>
        <motion.button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setSequence(instruments.map(() => Array(steps).fill(false)))
          }
        >
          Löschen
        </motion.button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {presets.map((preset, index) => (
          <Preset key={index} name={preset.name} pattern={preset.pattern} />
        ))}
      </div>
      <AnimatePresence>
        {isSampleMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Sample auswählen
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeSampleMenu}
                >
                  <X size={24} className="text-white" />
                </motion.button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {sampleLibrary.map((sample, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md mb-2 flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => changeSample(sample.url)}
                  >
                    <Music size={16} className="mr-2" />
                    {sample.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAudioStepSequencer;
