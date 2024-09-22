"use client"; // Mark this as a client-side component

import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import styled from "styled-components";
import * as Tone from "tone";

interface WaveformProps {
  audioFile: File;
}

const Waveform: React.FC<WaveformProps> = ({ audioFile }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);

  useEffect(() => {
    if (audioFile && waveformRef.current) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          // Create a WaveSurfer instance
          wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#ddd",
            progressColor: "#aaa",
            cursorColor: "#333",
            height: 100,
            scrollParent: true,
          });

          wavesurferRef.current.loadBlob(audioFile); // Load the audio file into wavesurfer
        }
      };

      reader.readAsDataURL(audioFile);

      // Cleanup the WaveSurfer instance on component unmount
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [audioFile]);

  // Syncing with the Transport and drawing waveform progress
  useEffect(() => {
    let animationFrameId: number;

    const drawWaveform = () => {
      if (Tone.Transport.state === "started") {
        const currentTime = Tone.Transport.seconds; // Check if Transport is running

        if (wavesurferRef.current) {
          const totalDuration = wavesurferRef.current.getDuration();
          if (totalDuration > 0) {
            wavesurferRef.current.seekTo(currentTime / totalDuration); // Sync the waveform with playback
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawWaveform); // Continue the animation loop
    };

    drawWaveform(); // Start the animation

    return () => {
      cancelAnimationFrame(animationFrameId); // Cleanup the animation frame when unmounted
    };
  }, []);

  return <WaveContainer ref={waveformRef}></WaveContainer>;
};

// Styled Component
const WaveContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
`;

export default Waveform;
