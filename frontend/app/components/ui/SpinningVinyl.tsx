"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SpinningVinyl() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Turntable base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl"></div>

      {/* Turntable platter */}
      <motion.div
        className="absolute inset-4 bg-gray-700 rounded-full shadow-inner"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Vinyl record */}
        <motion.div
          className="absolute inset-2 bg-black rounded-full shadow-lg"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-4 rounded-full border-4 border-gray-800 opacity-30"></div>
          <div className="absolute inset-8 rounded-full border-4 border-gray-800 opacity-30"></div>
          <div className="absolute inset-12 rounded-full border-4 border-gray-800 opacity-30"></div>
          <div className="absolute inset-16 rounded-full border-4 border-gray-800 opacity-30"></div>

          {/* Record label */}
          <div className="absolute inset-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">MIDI SYNTH</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Tonearm */}
      <motion.div
        className="absolute top-4 right-4 w-32 h-4 bg-gray-600 rounded origin-right"
        animate={{ rotate: isPlaying ? 25 : 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 10 }}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
      </motion.div>

      {/* Play/Stop button */}
      <motion.button
        className="absolute bottom-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
      >
        {isPlaying ? "■" : "▶"}
      </motion.button>
    </div>
  );
}
