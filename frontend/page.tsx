"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import axios from "axios";
import Waveform from ".app/components/Waveform"; // Ensure this component exists

interface Track {
  id: number;
  file: string;
  player: Tone.Player;
  gainNode: Tone.Gain;
  eqNode: Tone.EQ3;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newTracks: Track[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("audioFile", file);

      try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const trackId = Date.now() + Math.random();

        // Create audio nodes for the track
        const gainNode = new Tone.Gain().toDestination();
        const eqNode = new Tone.EQ3(0, 0, 0).connect(gainNode);
        const player = new Tone.Player(res.data.filePath).connect(eqNode);

        const newTrack: Track = {
          id: trackId,
          file: res.data.filePath,
          player,
          gainNode,
          eqNode,
          volume: 0,
          bass: 0,
          mid: 0,
          treble: 0,
        };

        newTracks.push(newTrack);
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }

    setTracks((prevTracks) => [...prevTracks, ...newTracks]);
  };

  const handleVolumeChange = (
    trackId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id === trackId) {
          // Update the gain node's gain value
          track.gainNode.gain.setValueAtTime(Tone.dbToGain(value), Tone.now());
          return { ...track, volume: value };
        }
        return track;
      })
    );
  };

  const handleEQChange = (
    trackId: number,
    eqType: "bass" | "mid" | "treble",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id === trackId) {
          // Update the EQ node's parameters
          if (eqType === "bass") {
            track.eqNode.low.value = value;
          } else if (eqType === "mid") {
            track.eqNode.mid.value = value;
          } else if (eqType === "treble") {
            track.eqNode.high.value = value;
          }
          return { ...track, [eqType]: value };
        }
        return track;
      })
    );
  };

  const handlePlay = async (trackId: number) => {
    const track = tracks.find((t) => t.id === trackId);
    if (track && track.player) {
      try {
        await Tone.start(); // Ensure AudioContext is started
        console.log("AudioContext started successfully");
        track.player.start();
      } catch (error) {
        console.error("Error starting AudioContext", error);
      }
    }
  };

  const handleStop = (trackId: number) => {
    const track = tracks.find((t) => t.id === trackId);
    if (track && track.player) {
      track.player.stop();
    }
  };

  const handlePlayAll = async () => {
    await Tone.start();
    Tone.Transport.start();
    tracks.forEach((track) => {
      track.player.sync().start(0);
    });
  };

  const handleStopAll = () => {
    Tone.Transport.stop();
  };

  return (
    <div>
      <h1>Web DAW MVP</h1>
      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handlePlayAll}>Play All</button>
      <button onClick={handleStopAll}>Stop All</button>

      {tracks.map((track) => (
        <div key={track.id}>
          <h3>Track {track.id}</h3>
          {/* Display the waveform if Waveform component is available */}
          <Waveform file={track.file} />
          {/* Native audio controls (optional) */}
          <audio controls src={track.file}></audio>
          <button onClick={() => handlePlay(track.id)}>Play</button>
          <button onClick={() => handleStop(track.id)}>Stop</button>

          <div>
            <label>Volume: </label>
            <input
              type="range"
              min="-40"
              max="0"
              step="1"
              value={track.volume}
              onChange={(e) => handleVolumeChange(track.id, e)}
            />
            <span>{track.volume} dB</span>
          </div>

          {/* EQ Controls */}
          <div>
            <label>Bass: </label>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={track.bass}
              onChange={(e) => handleEQChange(track.id, "bass", e)}
            />
            <span>{track.bass} dB</span>
          </div>
          <div>
            <label>Mid: </label>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={track.mid}
              onChange={(e) => handleEQChange(track.id, "mid", e)}
            />
            <span>{track.mid} dB</span>
          </div>
          <div>
            <label>Treble: </label>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={track.treble}
              onChange={(e) => handleEQChange(track.id, "treble", e)}
            />
            <span>{track.treble} dB</span>
          </div>
        </div>
      ))}
    </div>
  );
}
