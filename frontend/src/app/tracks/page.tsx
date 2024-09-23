"use client";
// app/tracks/page.tsx
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import Track from "../../components/Track";
import * as Tone from "tone";

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setTracks((prevTracks) => [...prevTracks, ...acceptedFiles]); // Add multiple tracks
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handlePlayAll = async () => {
    await Tone.start(); // Ensure the AudioContext is started
    Tone.Transport.start();
  };

  const handlePauseAll = () => {
    Tone.Transport.pause();
  };

  return (
    <Container>
      <h1>Track Management</h1>

      {/* Drag and Drop Area */}
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop audio files here, or click to select them</p>
        )}
      </Dropzone>

      <button onClick={handlePlayAll}>Play All</button>
      <button onClick={handlePauseAll}>Pause All</button>

      {/* Render Multiple Tracks */}
      {tracks.map((audioFile, index) => (
        <Track key={index} audioFile={audioFile} trackIndex={index} />
      ))}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Dropzone = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  margin: 20px;
  background-color: #fafafa;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

export default Tracks;
