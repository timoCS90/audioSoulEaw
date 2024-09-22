"use client";
// app/layout.tsx
import React from "react";
import Navbar from "./components/Navbar";
import GlobalStyle from "./components/GlobalStyle"; // Import global styles
import styled from "styled-components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalStyle />
        <Container>
          <Navbar />
          <Main>{children}</Main>
          <Footer>
            © {new Date().getFullYear()} Web DAW - All Rights Reserved
          </Footer>
        </Container>
      </body>
    </html>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
`;
