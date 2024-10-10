import React, { useState, useRef, useEffect } from "react"; // Add useEffect to the import

const Delay: React.FC<{ audioContext: AudioContext | null }> = ({
  audioContext,
}) => {
  const [delayTime, setDelayTime] = useState(0.5);
  const [feedback, setFeedback] = useState(0.5);
  const [dryWet, setDryWet] = useState(0.5);

  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackGainRef = useRef<GainNode | null>(null);
  const dryWetGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (audioContext) {
      const delayNode = audioContext.createDelay();
      const feedbackGain = audioContext.createGain();
      const dryWetGain = audioContext.createGain();

      delayNode.delayTime.value = delayTime;
      feedbackGain.gain.value = feedback;
      dryWetGain.gain.value = dryWet;

      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode); // Feedback loop

      delayNodeRef.current = delayNode;
      feedbackGainRef.current = feedbackGain;
      dryWetGainRef.current = dryWetGain;
    }
  }, [audioContext, delayTime, feedback, dryWet]);

  return (
    <div>
      <h3>Delay Effect</h3>
      <div>
        <label>Delay Time: {delayTime}s</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={delayTime}
          onChange={(e) => setDelayTime(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Feedback: {feedback * 100}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={feedback}
          onChange={(e) => setFeedback(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Dry/Wet: {dryWet * 100}%</label>
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

export default Delay;
