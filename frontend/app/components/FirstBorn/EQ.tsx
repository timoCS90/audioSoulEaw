import React, { useState, useEffect } from "react";

interface EQProps {
  audioContext: AudioContext | null;
}

const EQ: React.FC<EQProps> = ({ audioContext }) => {
  const [lowGain, setLowGain] = useState(0); // Low-shelf filter gain
  const [midGain1, setMidGain1] = useState(0); // Bell filter 1 gain
  const [midGain2, setMidGain2] = useState(0); // Bell filter 2 gain
  const [highGain, setHighGain] = useState(0); // High-shelf filter gain

  const lowShelfRef = useRef<BiquadFilterNode | null>(null);
  const mid1Ref = useRef<BiquadFilterNode | null>(null);
  const mid2Ref = useRef<BiquadFilterNode | null>(null);
  const highShelfRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (audioContext) {
      lowShelfRef.current = audioContext.createBiquadFilter();
      mid1Ref.current = audioContext.createBiquadFilter();
      mid2Ref.current = audioContext.createBiquadFilter();
      highShelfRef.current = audioContext.createBiquadFilter();

      // Configure the filters
      lowShelfRef.current.type = "lowshelf";
      lowShelfRef.current.frequency.value = 200; // Low frequencies

      mid1Ref.current.type = "peaking";
      mid1Ref.current.frequency.value = 1000; // Mid frequencies 1

      mid2Ref.current.type = "peaking";
      mid2Ref.current.frequency.value = 3000; // Mid frequencies 2

      highShelfRef.current.type = "highshelf";
      highShelfRef.current.frequency.value = 8000; // High frequencies
    }
  }, [audioContext]);

  useEffect(() => {
    if (lowShelfRef.current) {
      lowShelfRef.current.gain.value = lowGain;
    }
    if (mid1Ref.current) {
      mid1Ref.current.gain.value = midGain1;
    }
    if (mid2Ref.current) {
      mid2Ref.current.gain.value = midGain2;
    }
    if (highShelfRef.current) {
      highShelfRef.current.gain.value = highGain;
    }
  }, [lowGain, midGain1, midGain2, highGain]);

  return (
    <div className="eq p-4 border rounded-lg space-y-4">
      <h4>Equalizer (Multi-band)</h4>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label>Low Gain</label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={lowGain}
            onChange={(e) => setLowGain(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Mid Gain 1</label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={midGain1}
            onChange={(e) => setMidGain1(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Mid Gain 2</label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={midGain2}
            onChange={(e) => setMidGain2(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>High Gain</label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={highGain}
            onChange={(e) => setHighGain(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default EQ;
