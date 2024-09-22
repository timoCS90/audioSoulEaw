"use client";
// app/tracks/page.tsx
import React from "react";
import styled from "styled-components";

export default function Tracks() {
  return (
    <Container>
      <h1>Manage Your Tracks</h1>
      <TracksContainer>
        {/* Placeholder for DAW Components */}
        <Track>
          <h3>Track 1</h3>
          <Waveform />
          {/* Add audio controls and effects here */}
        </Track>
        <Track>
          <h3>Track 2</h3>
          <Waveform />
        </Track>
      </TracksContainer>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Track = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Waveform = styled.div`
  background-color: #ccc;
  height: 100px;
  border-radius: 4px;
  margin: 10px 0;
`;
