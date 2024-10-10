"use client";

import React, { useState, memo, useEffect, useCallback } from "react";
import DraggableStepSequencer from "../components/StepSequencer/StepSequencer";
import SynthDemo from "../components/FirstBorn/SynthDemo";

// Example components
const Component1 = () => (
  <div className="flex">
    <div className="w-full flex-shrink">
      <DraggableStepSequencer />
    </div>
  </div>
);
const Component2 = () => (
  <div className="flex">
    <div className="w-full flex-shrink">
      <SynthDemo />
    </div>
  </div>
);
const Component3 = () => (
  <div className="p-4 bg-yellow-100">Component 3 Content</div>
);
const Component4 = () => (
  <div className="p-4 bg-red-100">Component 4 Content</div>
);
const Component5 = () => (
  <div className="p-4 bg-purple-100">Component 5 Content</div>
);

interface WindowData {
  id: number;
  title: string;
  content: React.ReactNode;
}

interface WindowProps {
  window: WindowData;
  isActive: boolean;
  onClick: () => void;
  onChangeContent: (newContent: React.ReactNode) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = memo(
  ({ window, isActive, onClick, onChangeContent, children }) => {
    return (
      <div
        className={`bg-gradient-to-tr bg-black to-gray-700 border-l border-gray-200 transition-all duration-500 ease-in-out flex flex-col ${
          isActive ? "flex-grow" : "flex-shrink-0 w-24"
        }`}
      >
        <div className="h-16 w-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-between px-2 flex-none">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClick}
              aria-expanded={isActive}
              className="text-[var(--white)] hover:text-gray-800"
            >
              {isActive ? "−" : "+"}
            </button>
            <h2 className={`font-bold ${!isActive && "sr-only"}`}>
              {window.title}
            </h2>
            {isActive && (
              <select
                onChange={(e) => {
                  const key = parseInt(e.target.value, 10);
                  const newContent = {
                    1: <Component1 />,
                    2: <Component2 />,
                    3: <Component3 />,
                    4: <Component4 />,
                    5: <Component5 />,
                  }[key];
                  onChangeContent(newContent || children);
                }}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                defaultValue=""
              >
                <option value="">Change Component</option>
                <option value="1">Component 1</option>
                <option value="2">Component 2</option>
                <option value="3">Component 3</option>
                <option value="4">Component 4</option>
                <option value="5">Component 5</option>
              </select>
            )}
          </div>
        </div>
        {isActive && (
          <div className="flex-1 overflow-hidden">
            <div className="p-4 h-full overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </div>
        )}
        {!isActive && (
          <div className="writing-vertical-lr text-center h-full py-4 text-gray-500 flex-1 flex items-center justify-center">
            {window.title}
          </div>
        )}
      </div>
    );
  }
);

Window.displayName = "Window";

interface WindowsProps {
  windows: WindowData[];
  activeWindows: number[];
  onWindowClick: (id: number) => void;
  onChangeContent: (id: number, newContent: React.ReactNode) => void;
}

const Windows: React.FC<WindowsProps> = memo(
  ({ windows, activeWindows, onWindowClick, onChangeContent }) => {
    return (
      <main className="flex-1 flex overflow-hidden">
        {windows.map((window) => (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindows.includes(window.id)}
            onClick={() => onWindowClick(window.id)}
            onChangeContent={(newContent) =>
              onChangeContent(window.id, newContent)
            }
          >
            {window.content}
          </Window>
        ))}
      </main>
    );
  }
);

Windows.displayName = "Windows";

export default function Page() {
  const [windows, setWindows] = useState<WindowData[]>([
    { id: 0, title: "Window 1", content: <Component1 /> },
    { id: 1, title: "Window 2", content: <Component2 /> },
    { id: 2, title: "Window 3", content: <Component3 /> },
    { id: 3, title: "Window 4", content: <Component4 /> },
    { id: 4, title: "Window 5", content: <Component5 /> },
  ]);
  const [activeWindows, setActiveWindows] = useState<number[]>([0, 1, 2, 3, 4]); // All windows initially active
  const [isFooterExpanded, setFooterExpanded] = useState<boolean>(false);

  const handleWindowClick = useCallback((id: number) => {
    setActiveWindows((prev) => {
      if (prev.includes(id)) {
        // If this is the only active window, don't close it
        if (prev.length === 1 && prev[0] === id) {
          return prev;
        }
        return prev.filter((windowId) => windowId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleChangeContent = useCallback(
    (id: number, newContent: React.ReactNode) => {
      console.log(`Changing content of window ${id}`);
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, content: newContent } : window
        )
      );
    },
    []
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = parseInt(event.key, 10);
      if (key >= 1 && key <= 5) {
        handleWindowClick(key - 1);
      }
    },
    [handleWindowClick]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Small Round Menu Button */}
      <button
        className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center z-10"
        onClick={() => {
          // Implement your menu logic here
          alert("Menu button clicked!");
        }}
      >
        ☰
      </button>

      <Windows
        windows={windows}
        activeWindows={activeWindows}
        onWindowClick={handleWindowClick}
        onChangeContent={handleChangeContent}
      />
      <footer
        className={`bg-gray-800 text-white p-4 text-center flex-none transition-all duration-300 ${
          isFooterExpanded ? "h-48" : "h-16"
        }`}
      >
        <button
          className="absolute bottom-2 right-4 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white px-2 py-1 rounded"
          onClick={() => setFooterExpanded(!isFooterExpanded)}
        >
          {isFooterExpanded ? "▼" : "▲"}
        </button>
        {isFooterExpanded && (
          <div className="mt-4">
            {/* Place your controls here */}
            <p>You can place your controls here.</p>
          </div>
        )}
      </footer>
    </div>
  );
}
