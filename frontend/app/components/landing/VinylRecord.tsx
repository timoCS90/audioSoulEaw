"use client";

import React, { useState, useEffect } from "react";

interface VinylRecordProps {
  isPlaying: boolean;
}

const VinylRecord = ({ isPlaying }: VinylRecordProps) => (
  <div className="relative w-64 h-64 md:w-80 md:h-80">
    <div
      className={`absolute inset-0 rounded-full bg-black ${
        isPlaying ? "animate-spin-slow" : ""
      }`}
    >
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--color-dark-blue)] to-[var(--color-yellow)]">
        <div className="absolute inset-8 rounded-full bg-black">
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-light-blue)] flex items-center justify-center">
            <span className="text-white text-xs md:text-sm font-bold">
              MOTOWN SYNTH
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function VinylRecordPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/example.mp3"); // Stellen Sie sicher, dass der Pfad korrekt ist
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-8">
        <VinylRecord isPlaying={isPlaying} />
      </div>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-gradient-to-r from-[var(--color-dark-blue)] to-[var(--color-yellow)] text-white font-bold py-3 px-6 rounded-full hover:from-[var(--color-light-blue)] hover:to-[var(--color-highlight)] transition duration-300 mb-8"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
