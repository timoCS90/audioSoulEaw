"use client"; // This ensures the component is rendered on the client side

import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "react-resizable/css/styles.css";
import MoogOne from "./MoogOne/MoogOne";
import Mixer from "./Mixer/Mixer";

const Layout: React.FC = ({}) => {
  return (
    <>
      <div className="layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <PanelGroup direction="horizontal">
            <Panel>left</Panel>
            <PanelResizeHandle className="panelResizeHandle" />
            <Panel>
              <PanelGroup direction="vertical">
                <Panel>
                  <MoogOne />
                </Panel>
                <PanelResizeHandle className="panelResizeHandle" />
                <Panel>
                  <PanelGroup direction="horizontal">
                    <Panel>
                      <Mixer />
                    </Panel>
                    <PanelResizeHandle className="panelResizeHandle" />
                    <Panel>right</Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle />
            <Panel>right</Panel>
          </PanelGroup>
        </div>
        <Footer />
      </div>
    </>
  );
};

const Navbar: React.FC = () => <nav className="navbar">Navbar</nav>;

const Sidebar: React.FC = () => <aside className="sidebar">Sidebar</aside>;

const Footer: React.FC = () => <footer className="footer">Footer</footer>;

export default Layout;
