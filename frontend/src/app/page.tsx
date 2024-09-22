"use client";
// app/page.tsx
import React from "react";
import styled from "styled-components";
import Synthesizer from "./components/Synthesizer";

export default function Home() {
  return (
    <Container>
      <Synthesizer />
      <h1>Welcome to Web DAW</h1>
      <p>Start creating and mixing your tracks here.</p>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;
