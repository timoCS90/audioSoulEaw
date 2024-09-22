// Waveform.tsx
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  file: string;
}

const Waveform: React.FC<WaveformProps> = ({ file }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      // Initialize WaveSurfer
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#aaa",
        cursorColor: "#333",
        height: 80,
      });

      // Load the audio file
      wavesurferRef.current.load(file);

      // Cleanup on unmount
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [file]);

  return <div ref={waveformRef} />;
};

export default Waveform;
