import React, { useState, useRef, useEffect } from "react";

interface ReverbProps {
  audioContext: AudioContext | null;
}

const Reverb: React.FC<ReverbProps> = ({ audioContext }) => {
  const [depth, setDepth] = useState(0.5);
  const [dryWet, setDryWet] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);

  const convolverNodeRef = useRef<ConvolverNode | null>(null);
  const cachedImpulseBuffer = useRef<AudioBuffer | null>(null);

  const loadImpulseResponse = async (context: AudioContext) => {
    if (cachedImpulseBuffer.current) return cachedImpulseBuffer.current;

    setIsLoading(true);
    try {
      const response = await fetch("/impulses/impulse.wav");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      cachedImpulseBuffer.current = audioBuffer;
      setIsLoading(false);
      return audioBuffer;
    } catch (error) {
      console.error("Failed to load impulse response:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioContext) {
      const convolverNode = audioContext.createConvolver();
      loadImpulseResponse(audioContext).then((buffer) => {
        if (buffer) convolverNode.buffer = buffer;
      });
      convolverNodeRef.current = convolverNode;
    }
  }, [audioContext]);

  return (
    <div className="reverb p-4 border rounded-lg">
      <h4>Reverb Effect</h4>
      {isLoading ? <div>Loading impulse response...</div> : null}
      <div>
        <label>Reverb Depth</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Dry/Wet Mix</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={dryWet}
          onChange={(e) => setDryWet(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Reverb;
