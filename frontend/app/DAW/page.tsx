"use client";

import React, { useState, memo, useEffect, useCallback } from "react";
import DraggableStepSequencer from "../components/StepSequencer/StepSequencer";

// Beispielkomponenten
const Component1 = () => (
  <div className="flex">
    <div className="w-full flex-shrink">
      <DraggableStepSequencer />
    </div>
  </div>
);
const Component2 = () => (
  <div className="p-4 bg-green-100">Component 2 Inhalt</div>
);
const Component3 = () => (
  <div className="p-4 bg-yellow-100">Component 3 Inhalt</div>
);
const Component4 = () => (
  <div className="p-4 bg-red-100">Component 4 Inhalt</div>
);
const Component5 = () => (
  <div className="p-4 bg-purple-100">Component 5 Inhalt</div>
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
        className={`bg-white border-l border-gray-200 transition-all duration-1000 ease-in-out ${
          isActive ? "flex-1 flex flex-col" : "w-16 flex flex-col"
        }`}
      >
        <button
          className="h-16 w-full bg-gray-100 flex items-center justify-between px-4 flex-none"
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
          <div className="flex-1 overflow-hidden">
            <div className="p-4 h-full overflow-hidden flex flex-col">
              <div className="flex-1 overflow-hidden">{children}</div>
              <div className="mt-4">
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
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  defaultValue=""
                >
                  <option value="">Komponente ändern</option>
                  <option value="1">Komponente 1</option>
                  <option value="2">Komponente 2</option>
                  <option value="3">Komponente 3</option>
                  <option value="4">Komponente 4</option>
                  <option value="5">Komponente 5</option>
                </select>
              </div>
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
    { id: 0, title: "Fenster 1", content: <Component1 /> },
    { id: 1, title: "Fenster 2", content: <Component2 /> },
    { id: 2, title: "Fenster 3", content: <Component3 /> },
    { id: 3, title: "Fenster 4", content: <Component4 /> },
    { id: 4, title: "Fenster 5", content: <Component5 /> },
  ]);
  const [activeWindows, setActiveWindows] = useState<number[]>([0, 1, 2, 3, 4]); // Alle Fenster initial aktiv

  const handleWindowClick = useCallback((id: number) => {
    setActiveWindows((prev) => {
      if (prev.includes(id)) {
        // Wenn dies das einzige aktive Fenster ist, schließe es nicht
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
      console.log(`Ändere Inhalt von Fenster ${id}`);
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
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-gray-800 text-white p-4 flex-none">
        <h1 className="text-2xl font-bold">Dynamic Windows App</h1>
        <p className="text-sm mt-2">
          Drücke die Tasten 1-5, um Fenster zu toggeln. Benutze das Dropdown, um
          den Fensterinhalt zu ändern.
        </p>
      </header>
      <Windows
        windows={windows}
        activeWindows={activeWindows}
        onWindowClick={handleWindowClick}
        onChangeContent={handleChangeContent}
      />
      <footer className="bg-gray-800 text-white p-4 text-center flex-none">
        <p>&copy; 2023 Dynamic Windows App. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
