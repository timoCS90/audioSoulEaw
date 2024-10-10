"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const frequencyBands = [
  { freq: 60, label: "60Hz", color: "#FF6B6B" },
  { freq: 170, label: "170Hz", color: "#Feca57" },
  { freq: 310, label: "310Hz", color: "#48dbfb" },
  { freq: 600, label: "600Hz", color: "#ff9ff3" },
  { freq: 1000, label: "1kHz", color: "#54a0ff" },
  { freq: 3000, label: "3kHz", color: "#5f27cd" },
  { freq: 6000, label: "6kHz", color: "#ff6b6b" },
  { freq: 12000, label: "12kHz", color: "#ff9ff3" },
];

const PracticalEqualizer = () => {
  const [gains, setGains] = useState(frequencyBands.map(() => 0));
  const [isEnabled, setIsEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawEQCurve = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isEnabled) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      frequencyBands.forEach((band, index) => {
        gradient.addColorStop(index / (frequencyBands.length - 1), band.color);
      });

      for (let x = 0; x < canvas.width; x++) {
        const freqExp =
          Math.log2(20) +
          (x / canvas.width) * (Math.log2(20000) - Math.log2(20));
        const freq = Math.pow(2, freqExp);
        let y = 0;

        for (let i = 0; i < frequencyBands.length; i++) {
          const band = frequencyBands[i];
          const gain = gains[i];
          const bandwidth = 1.5; // Q factor, adjust as needed
          y +=
            gain *
            Math.exp(
              -Math.pow((Math.log2(freq) - Math.log2(band.freq)) / bandwidth, 2)
            );
        }

        ctx.lineTo(x, canvas.height / 2 - y * 4);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    drawEQCurve();
  }, [gains, isEnabled]);

  const FrequencyBand = ({
    freq,
    label,
    gain,
    index,
    color,
  }: {
    freq: number;
    label: string;
    gain: number;
    index: number;
    color: string;
  }) => {
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newGain = parseFloat(event.target.value);
      const newGains = [...gains];
      newGains[index] = newGain;
      setGains(newGains);
    };

    return (
      <div className="flex flex-col items-center">
        <input
          type="range"
          min="-12"
          max="12"
          step="0.1"
          value={gain}
          onChange={handleSliderChange}
          className="w-4 h-48 -rotate-180 appearance-none bg-gray-700 rounded-full outline-none"
          style={{
            background: `linear-gradient(to top, ${color}, ${color}22)`,
            WebkitAppearance: "slider-vertical",
          }}
        />
        <span className="mt-2 text-xs font-medium text-gray-300">{label}</span>
        <span className="text-xs text-gray-400">{gain.toFixed(1)}dB</span>
      </div>
    );
  };

  const Preset = ({ name, gains }: { name: string; gains: number[] }) => (
    <motion.button
      className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setGains(gains)}
    >
      {name}
    </motion.button>
  );

  return (
    <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">8-Band Equalizer</h2>
        <div className="flex items-center">
          <span className="mr-2 text-white">Enabled</span>
          <motion.button
            className={`w-12 h-6 rounded-full p-1 ${
              isEnabled ? "bg-indigo-600" : "bg-gray-700"
            }`}
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <motion.div
              className="w-4 h-4 bg-white rounded-full"
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              style={{ x: isEnabled ? 24 : 0 }}
            />
          </motion.button>
        </div>
      </div>
      <div className="mb-8">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 bg-gray-800 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-8 gap-4 mb-6">
        {frequencyBands.map((band, index) => (
          <FrequencyBand
            key={band.freq}
            freq={band.freq}
            label={band.label}
            gain={gains[index]}
            index={index}
            color={band.color}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Presets</h3>
        <motion.button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGains(frequencyBands.map(() => 0))}
        >
          Reset
        </motion.button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Preset name="Bass Boost" gains={[6, 5, 4, 2, 0, 0, 0, 0]} />
        <Preset name="Treble Boost" gains={[0, 0, 0, 0, 2, 4, 5, 6]} />
        <Preset name="V-Curve" gains={[4, 2, 0, -2, -2, 0, 2, 4]} />
      </div>
    </div>
  );
};

export default PracticalEqualizer;
