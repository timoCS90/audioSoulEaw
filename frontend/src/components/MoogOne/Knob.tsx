import React from "react";

interface KnobProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Knob: React.FC<KnobProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div className="knob">
    <label>{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
    <span>{value}</span>
  </div>
);

export default Knob;
