"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as Tone from "tone";
import Waveform from "./Waveform";

interface TrackProps {
  audioFile: File;
  trackIndex: number;
}

const Track: React.FC<TrackProps> = ({ audioFile, trackIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Tone.Player | null>(null);

  // Initialize player and load the audio file
  useEffect(() => {
    const objectURL = URL.createObjectURL(audioFile);
    playerRef.current = new Tone.Player(objectURL).toDestination();
    playerRef.current.sync().start(0); // Sync the player to the Transport

    return () => {
      playerRef.current?.dispose();
    };
  }, [audioFile]);

  // Play/Pause toggle using Tone.Transport
  const handlePlayPause = () => {
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  return (
    <TrackContainer>
      <Waveform audioFile={audioFile} />
      <Controls>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </Controls>
    </TrackContainer>
  );
};

// Styled Components
const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default Track;
