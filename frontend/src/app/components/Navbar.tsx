// components/Navbar.tsx
import React from "react";
import styled from "styled-components";
import Link from "next/link"; // Next.js's Link component for client-side navigation

const Navbar: React.FC = () => {
  return (
    <Nav>
      <NavList>
        <NavItem>
          <Link href="/">Home</Link>
        </NavItem>
        <NavItem>
          <Link href="/tracks">Tracks</Link>
        </NavItem>
        <NavItem>
          <Link href="/settings">Settings</Link>
        </NavItem>
        <NavItem>
          <Link href="/help">Help</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
};

// Styled Components
const Nav = styled.nav`
  background-color: #333;
  padding: 10px;
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Navbar;
