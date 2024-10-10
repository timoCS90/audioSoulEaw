import React, { useState, useEffect } from "react";

interface AudioRouterProps {
  audioContext: AudioContext | null;
  sourceNode: AudioNode | null; // The source (oscillator, etc.) that needs routing
  targets: { name: string; node?: AudioNode }[]; // The list of targets like ADSR, Delay, Reverb, etc.
  setOutputNode: (node: AudioNode) => void; // Function to update the final output node
}

const AudioRouter: React.FC<AudioRouterProps> = ({
  audioContext,
  sourceNode,
  targets,
  setOutputNode,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>("master");

  const handleRoutingChange = (targetName: string) => {
    if (audioContext && sourceNode) {
      // Disconnect the source from any previous connections
      sourceNode.disconnect();

      const selected = targets.find(
        (target) => target.name === targetName && target.node
      );
      if (selected && selected.node) {
        sourceNode.connect(selected.node);
        setOutputNode(selected.node); // Update the final output node to this target
      } else {
        // Default to connecting to the audioContext.destination (master output)
        sourceNode.connect(audioContext.destination);
        setOutputNode(audioContext.destination);
      }

      setSelectedTarget(targetName);
    } else {
      console.error("AudioContext or SourceNode is not initialized");
    }
  };

  useEffect(() => {
    // Automatically route to master if there's no selection or available target
    if (audioContext && sourceNode) {
      sourceNode.connect(audioContext.destination);
    }
  }, [audioContext, sourceNode]);

  return (
    <div className="audio-router">
      <label>Route to:</label>
      <select
        value={selectedTarget}
        onChange={(e) => handleRoutingChange(e.target.value)}
        disabled={!audioContext || !sourceNode} // Disable if not ready
      >
        {targets.map((target) => (
          <option key={target.name} value={target.name}>
            {target.name}
          </option>
        ))}
        <option value="master">Master</option>
      </select>
    </div>
  );
};

export default AudioRouter;
