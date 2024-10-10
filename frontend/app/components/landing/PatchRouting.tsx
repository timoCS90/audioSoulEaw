"use client";

import React, { useState } from "react";

type Module = {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
};

type Connection = {
  from: { moduleId: string; port: string };
  to: { moduleId: string; port: string };
};

const modules: Module[] = [
  { id: "osc", name: "Oscillator", inputs: [], outputs: ["out"] },
  { id: "filter", name: "Filter", inputs: ["in", "cutoff"], outputs: ["out"] },
  { id: "env", name: "Envelope", inputs: ["trigger"], outputs: ["out"] },
  { id: "lfo", name: "LFO", inputs: [], outputs: ["out"] },
  { id: "out", name: "Output", inputs: ["in"], outputs: [] },
];

const ModuleBox = ({
  module,
  onConnect,
}: {
  module: Module;
  onConnect: (moduleId: string, port: string, isInput: boolean) => void;
}) => (
  <div className="bg-[var(--text)] m-2 p-12 rounded-full shadow-lg outline outline-offset-4 hover:outline-offset-2">
    <h4 className="text-lg font-semibold mb-2">{module.name}</h4>
    <div className="flex justify-between">
      <div>
        {module.inputs.map((input) => (
          <button
            key={input}
            className="block m-2 w-4 h-4 bg-red-500 rounded-full outline outline-offset-4 hover:outline-offset-2 outline-red-500"
            onClick={() => onConnect(module.id, input, true)}
            aria-label={`Connect to input ${input} of ${module.name}`}
          />
        ))}
      </div>
      <div>
        {module.outputs.map((output) => (
          <button
            key={output}
            className="block m-2 w-4 h-4 bg-green-500 rounded-full outline outline-offset-4 hover:outline-offset-2 outline-green-500"
            onClick={() => onConnect(module.id, output, false)}
            aria-label={`Connect from output ${output} of ${module.name}`}
          />
        ))}
      </div>
    </div>
  </div>
);

export default function PatchCableInfoSection() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeConnection, setActiveConnection] =
    useState<Partial<Connection> | null>(null);

  const handleConnect = (moduleId: string, port: string, isInput: boolean) => {
    if (!activeConnection) {
      setActiveConnection(
        isInput ? { to: { moduleId, port } } : { from: { moduleId, port } }
      );
    } else {
      if (isInput && activeConnection.from) {
        setConnections([
          ...connections,
          { ...activeConnection, to: { moduleId, port } } as Connection,
        ]);
        setActiveConnection(null);
      } else if (!isInput && activeConnection.to) {
        setConnections([
          ...connections,
          { ...activeConnection, from: { moduleId, port } } as Connection,
        ]);
        setActiveConnection(null);
      }
    }
  };

  return (
    <section className="h-screen">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold p-24 text-center">
          Create Your Sound Path
        </h2>
        <div className="mb-8">
          <p className="text-center text-2xl mb-4">
            Connect modules by clicking on the colored dots. Red dots are
            inputs, green dots are outputs.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {modules.map((module) => (
              <ModuleBox
                key={module.id}
                module={module}
                onConnect={handleConnect}
              />
            ))}
          </div>
        </div>
        <div className="bg-[var(--text)] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Active Connections</h3>
          {connections.length === 0 ? (
            <p>No connections yet. Start patching!</p>
          ) : (
            <ul>
              {connections.map((conn, index) => (
                <li key={index}>
                  {conn.from.moduleId} ({conn.from.port}) → {conn.to.moduleId} (
                  {conn.to.port})
                </li>
              ))}
            </ul>
          )}
          ;
        </div>
      </div>
    </section>
  );
}
