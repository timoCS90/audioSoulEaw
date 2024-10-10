"use client";
// Definieren Sie die Varianten außerhalb der Komponente
const movementVariants = {
  initial: { y: 0, x: 0, scale: 1 },
  fall: {
    y: [0, -100, 200, 800, 1200],
    x: [0, 20, 70, 100, 200],
    transition: {
      duration: 1,
      ease: "easeIn",
    },
  },
};

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function SpinningVinyl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const vinylRotationControls = useAnimation(); // Für Rotation
  const vinylMovementControls = useAnimation(); // Für Bewegung
  const platterControls = useAnimation();
  const tonearmControls = useAnimation();

  const startSequence = async () => {
    setIsPlaying(true);

    // Tonearm senkt sich mit einem Bounce-Effekt
    await tonearmControls.start({
      rotate: [0, 30, 20, 25],
      transition: { duration: 0.5, times: [0, 0.6, 0.8, 1], ease: "easeInOut" },
    });

    // Kontinuierliche Rotation (unendlich)
    vinylRotationControls.start({
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 2, ease: "linear" },
    });

    platterControls.start({
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 2, ease: "linear" },
    });

    // Verlängerte Wartezeit bevor der Fall beginnt (z.B. 1 Sekunde)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Phase 1: Fall gerade nach unten
    await vinylMovementControls.start("fall");

    // Phase 2: Roll leicht zur Seite
    await vinylMovementControls.start("roll");

    // Phase 3: Verschwindet vollständig
    await vinylMovementControls.start("disappear");

    // Tonearm kehrt mit einem Wackeleffekt zurück
    await tonearmControls.start({
      rotate: [25, -5, 10, -3, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.3, 0.5, 0.7, 1],
        ease: "easeInOut",
      },
    });

    // Verzögerung bevor zur nächsten Sektion gescrollt wird (z.B. 1 Sekunde)
    setTimeout(() => {
      document.getElementById("example").scrollIntoView({ behavior: "smooth" });
    }); // 1 Sekunde Verzögerung

    // Zurücksetzen nach dem Fall
    setIsPlaying(false);
    await vinylMovementControls.start({
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0 },
    });
    await vinylRotationControls.start({
      rotate: 0,
      transition: { duration: 0 },
    });
  };

  return (
    <div>
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Turntable base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-xl overflow-hidden">
          {/* Comic-style speed lines when spinning */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 1 : 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-0.5 bg-white opacity-50"
                style={{ transform: `rotate(${i * 22.5}deg)` }}
              />
            ))}
          </motion.div>
        </div>

        {/* Bewegungs-Wrapper (steuert das Fallen und Bewegen) */}
        <motion.div
          className="absolute inset-4"
          variants={movementVariants}
          initial="initial"
          animate={vinylMovementControls}
        >
          {/* Rotations-Wrapper (steuert nur das Drehen) */}
          <motion.div
            className="absolute inset-0 bg-black rounded-full shadow-lg"
            animate={vinylRotationControls}
          >
            {/* Vinyl grooves */}
            <div className="absolute inset-4 rounded-full border-4 border-gray-800 opacity-30"></div>
            <div className="absolute inset-8 rounded-full border-4 border-gray-800 opacity-30"></div>
            <div className="absolute inset-12 rounded-full border-4 border-gray-800 opacity-30"></div>
            <div className="absolute inset-16 rounded-full border-4 border-gray-800 opacity-30"></div>

            {/* Record label */}
            <div className="absolute inset-20 bg-gradient-to-br from-[var(--primary)] to-[var(--third)] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">audio soul</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Tonearm */}
        <motion.div
          className="absolute top-4 right-4 w-32 h-4 bg-gray-600 rounded origin-right"
          animate={tonearmControls}
        >
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
        </motion.div>

        {/* Play/Stop button */}
        <motion.button
          className="absolute bottom-4 right-4 w-12 h-12 bg-[var(--third)] rounded-full flex items-center justify-center text-white font-bold shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startSequence}
          disabled={isPlaying}
        >
          {isPlaying ? "■" : "▶"}
        </motion.button>
      </div>
    </div>
  );
}
