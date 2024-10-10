import React, { useState, useRef, useEffect } from "react"; // Add useRef to the import

const MasterVolume: React.FC<{
  audioContext: AudioContext | null;
  finalNode: GainNode | null;
}> = ({ audioContext, finalNode }) => {
  const [volume, setVolume] = useState(0.8); // Master volume level
  const masterGainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (audioContext && finalNode) {
      const masterGainNode = audioContext.createGain();
      masterGainNode.gain.value = volume;
      masterGainNode.connect(finalNode); // Connect master volume control to the final node

      masterGainNodeRef.current = masterGainNode;
    }
  }, [audioContext, finalNode, volume]);

  return (
    <div className="master-volume-control">
      <label>Master Volume</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      <span>{(volume * 100).toFixed(0)}%</span>
    </div>
  );
};

export default MasterVolume;
