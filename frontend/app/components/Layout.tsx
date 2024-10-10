"use client";

import React, { useState, memo, useEffect, useCallback } from "react";

// Example components
const Component1 = () => (
  <div className="p-4 bg-blue-100">Component 1 Content</div>
);
const Component2 = () => (
  <div className="p-4 bg-green-100">Component 2 Content</div>
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
        className={`bg-white border-l border-gray-200 transition-all duration-500 ease-in-out ${
          isActive ? "flex-1" : "w-16"
        }`}
      >
        <button
          className="h-16 w-full bg-gray-100 flex items-center justify-between px-4"
          onClick={onClick}
          aria-expanded={isActive}
        >
          <h2 className={`font-bold ${!isActive && "sr-only"}`}>
            {window.title}
          </h2>
          <span
            className="text-gray-600 hover:text-gray-800"
            aria-hidden="true"
          >
            {isActive ? "−" : "+"}
          </span>
        </button>
        {isActive && (
          <div
            className="p-4 overflow-auto"
            style={{ height: "calc(100% - 4rem)" }}
          >
            {children}
            <div className="mt-4">
              <select
                onChange={(e) => {
                  const newContent = {
                    1: <Component1 />,
                    2: <Component2 />,
                    3: <Component3 />,
                    4: <Component4 />,
                    5: <Component5 />,
                  }[e.target.value];
                  onChangeContent(newContent || children);
                }}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Change Component</option>
                <option value="1">Component 1</option>
                <option value="2">Component 2</option>
                <option value="3">Component 3</option>
                <option value="4">Component 4</option>
                <option value="5">Component 5</option>
              </select>
            </div>
          </div>
        )}
        {!isActive && (
          <div className="writing-vertical-lr text-center h-full py-4 text-gray-500">
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
      <main className="flex-1 flex">
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
  const [activeWindows, setActiveWindows] = useState<number[]>([0]);

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
      const key = parseInt(event.key);
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Dynamic Windows App</h1>
        <p className="text-sm mt-2">
          Press keys 1-5 to toggle windows. Use the dropdown to change window
          content.
        </p>
      </header>
      <Windows
        windows={windows}
        activeWindows={activeWindows}
        onWindowClick={handleWindowClick}
        onChangeContent={handleChangeContent}
      />
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Dynamic Windows App. All rights reserved.</p>
      </footer>
    </div>
  );
}
