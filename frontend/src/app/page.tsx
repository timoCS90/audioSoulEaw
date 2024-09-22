"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import axios from "axios";

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [player, setPlayer] = useState(null);

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("audioFile", file);

    try {
      // Upload the file to the backend
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Load the file into Tone.js Player
      const player = new Tone.Player(res.data.filePath).toDestination();
      setPlayer(player);
      setAudioFile(res.data.filePath); // Set the file path for potential playback
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  // Play the audio file using Tone.js
  const handlePlay = () => {
    if (player) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  };

  return (
    <div>
      <h1>Web DAW MVP</h1>
      <input type="file" onChange={handleFileChange} />
      {audioFile && (
        <div>
          <audio controls src={audioFile}></audio>{" "}
          {/* Browser-based playback */}
          <button onClick={handlePlay}>Play with Tone.js</button>
        </div>
      )}
    </div>
  );
}
