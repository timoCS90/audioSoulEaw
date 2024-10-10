"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

const RefinedADSREnvelope = () => {
  const [attack, setAttack] = useState(20);
  const [decay, setDecay] = useState(60);
  const [sustain, setSustain] = useState(50);
  const [release, setRelease] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);

  const envelopeRef = useRef<SVGSVGElement>(null);
  const controls = useAnimation();
  const progress = useMotionValue(0);
  const pathLength = useTransform(progress, [0, 100], [0, 1]);

  const createCurve = useCallback(
    (start: number, end: number, curvature: number, steps: number) => {
      const points = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const v = start + (end - start) * (1 - Math.pow(1 - t, curvature));
        points.push(v);
      }
      return points;
    },
    []
  );

  const createPath = useCallback(() => {
    const attackCurve = createCurve(100, 0, 2, 20);
    const decayCurve = createCurve(0, 100 - sustain, 1.5, 20);
    const releaseCurve = createCurve(100 - sustain, 100, 2, 20);

    let path = `M 0,100 `;

    // Attack
    attackCurve.forEach((y, i) => {
      path += `L ${(i / 20) * attack},${y} `;
    });

    // Decay
    decayCurve.forEach((y, i) => {
      path += `L ${attack + (i / 20) * (decay - attack)},${
        (y * (100 - sustain)) / 100 + sustain
      } `;
    });

    // Sustain
    path += `L ${release},${100 - sustain} `;

    // Release
    releaseCurve.forEach((y, i) => {
      path += `L ${release + (i / 20) * (100 - release)},${y} `;
    });

    return path;
  }, [attack, decay, sustain, release, createCurve]);

  const handlePlay = async () => {
    setIsPlaying(true);
    await controls.start({
      pathLength: 1,
      transition: { duration: 2, ease: "linear" },
    });
    if (!loop) setIsPlaying(false);
    controls.set({ pathLength: 0 });
    if (loop) handlePlay();
  };

  const handleStop = () => {
    setIsPlaying(false);
    controls.stop();
    controls.set({ pathLength: 0 });
  };

  const RoundKnob = ({
    param,
    value,
    onChange,
    color,
  }: {
    param: string;
    value: number;
    onChange: (value: number) => void;
    color: string;
  }) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const angle = useTransform(useMotionValue(value), [0, 100], [0, 270]);

    const handleKnobInteraction = (
      event: React.PointerEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      const knob = knobRef.current;
      if (!knob) return;

      const knobRect = knob.getBoundingClientRect();
      const knobCenter = {
        x: knobRect.left + knobRect.width / 2,
        y: knobRect.top + knobRect.height / 2,
      };

      const startAngle = Math.atan2(
        event.clientY - knobCenter.y,
        event.clientX - knobCenter.x
      );
      const startValue = value;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const currentAngle = Math.atan2(
          moveEvent.clientY - knobCenter.y,
          moveEvent.clientX - knobCenter.x
        );
        let deltaAngle = currentAngle - startAngle;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;

        const deltaValue = (deltaAngle / ((Math.PI * 3) / 2)) * 100;
        let newValue = startValue + deltaValue;
        newValue = Math.max(0, Math.min(100, newValue));
        onChange(Math.round(newValue));
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    };

    return (
      <motion.div
        ref={knobRef}
        className="w-20 h-20 rounded-full bg-gray-800 shadow-lg flex items-center justify-center cursor-pointer relative"
        style={{ boxShadow: `0 0 10px ${color}44, inset 0 0 5px ${color}44` }}
        whileTap={{ scale: 0.95 }}
        onPointerDown={handleKnobInteraction}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center"
          style={{ boxShadow: `inset 0 0 10px ${color}88` }}
        >
          <motion.div
            className="w-1 h-8 bg-white rounded-full origin-bottom"
            style={{ rotate: angle, backgroundColor: color }}
          />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      </motion.div>
    );
  };

  const handleEnvelopeClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = envelopeRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = 100 - ((event.clientY - rect.top) / rect.height) * 100;

    if (x <= attack) {
      setAttack(Math.round(x));
    } else if (x <= decay) {
      setDecay(Math.round(x));
      setSustain(Math.round(y));
    } else if (x <= release) {
      setRelease(Math.round(x));
      setSustain(Math.round(y));
    } else {
      setRelease(Math.round(x));
    }
  };

  return (
    <div className="w-full max-w-3xl bg-gray-900 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Refined ADSR Envelope
      </h2>
      <div className="flex justify-between items-center mb-8">
        <motion.button
          className={`px-6 py-2 rounded-full font-semibold text-white ${
            isPlaying ? "bg-red-500" : "bg-green-500"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPlaying ? handleStop : handlePlay}
        >
          {isPlaying ? "Stop" : "Play"}
        </motion.button>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="loop"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="loop" className="text-white">
            Loop
          </label>
        </div>
      </div>
      <div className="w-full h-64 relative mb-8 bg-gray-800 rounded-lg p-4">
        <svg
          ref={envelopeRef}
          viewBox="0 0 100 100"
          className="w-full h-full cursor-crosshair"
          onClick={handleEnvelopeClick}
        >
          <defs>
            <linearGradient id="envelope-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="33%" stopColor="#4ECDC4" />
              <stop offset="66%" stopColor="#45B7D1" />
              <stop offset="100%" stopColor="#F7797D" />
            </linearGradient>
          </defs>
          <path
            d={createPath()}
            fill="none"
            stroke="url(#envelope-gradient)"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
          <motion.path
            d={createPath()}
            fill="none"
            stroke="url(#envelope-gradient)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={controls}
          />
        </svg>
        <motion.div
          className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
          style={{
            pathLength,
            offsetDistance: "0%",
            offsetPath: `path("${createPath()}")`,
          }}
        />
      </div>
      <div className="grid grid-cols-4 gap-8">
        {[
          {
            param: "attack",
            value: attack,
            setter: setAttack,
            color: "#FF6B6B",
          },
          { param: "decay", value: decay, setter: setDecay, color: "#4ECDC4" },
          {
            param: "sustain",
            value: sustain,
            setter: setSustain,
            color: "#45B7D1",
          },
          {
            param: "release",
            value: release,
            setter: setRelease,
            color: "#F7797D",
          },
        ].map(({ param, value, setter, color }) => (
          <div key={param} className="flex flex-col items-center">
            <RoundKnob
              param={param}
              value={value}
              onChange={setter}
              color={color}
            />
            <span className="mt-2 text-sm font-medium text-white capitalize">
              {param}
            </span>
            <span className="text-xs text-gray-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefinedADSREnvelope;
