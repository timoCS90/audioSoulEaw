// app/help/page.tsx
import React from "react";
import styled from "styled-components";

export default function Help() {
  return (
    <Container>
      <h1>Help & Documentation</h1>
      <p>Find tutorials and information on using the DAW here.</p>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;
