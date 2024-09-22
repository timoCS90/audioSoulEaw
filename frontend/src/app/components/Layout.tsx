"use client";
import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar"; // Import the Navbar

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Main>{children}</Main> {/* This will render the page content */}
      <Footer>
        © {new Date().getFullYear()} Web DAW - All Rights Reserved
      </Footer>
    </Container>
  );
};

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

export default Layout;
