// Slider.tsx
import React from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <div className="slider-container">
      <label className="slider-label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min} // Ensure fallback if `value` is undefined
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      <span>{value?.toFixed(2) ?? "0.00"}</span> {/* Display formatted value */}
    </div>
  );
};

export default Slider;
