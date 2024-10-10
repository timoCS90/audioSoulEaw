export interface Preset {
  name: string;
  playbackRate: number;
  filterFrequency: number;
  distortion: number;
  delay: number;
  reverb: number;
}

export interface PresetButtonsProps {
  presets: Preset[];
  activePreset: number | null;
  applyPreset: (index: number) => void;
}

const PresetButtons = ({
  presets,
  activePreset,
  applyPreset,
}: PresetButtonsProps) => {
  return (
    <div className="preset-buttons">
      {presets.map((preset, index) => (
        <button
          key={index}
          onClick={() => applyPreset(index)}
          className={activePreset === index ? "active" : ""}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};

export default PresetButtons;
