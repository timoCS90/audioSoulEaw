const ADSR = ({ title }: { title: string }) => {
  return (
    <ControlGroup title={title}>
      <div className="grid grid-cols-4 gap-4">
        <input type="range" min="0" max="1" step="0.01" label="Attack" />
        <input type="range" min="0" max="1" step="0.01" label="Decay" />
        <input type="range" min="0" max="1" step="0.01" label="Sustain" />
        <input type="range" min="0" max="1" step="0.01" label="Release" />
      </div>
    </ControlGroup>
  );
};

const Delay = () => {
  return (
    <ControlGroup title="Delay">
      <div className="grid grid-cols-2 gap-4">
        <input type="range" min="0" max="1" step="0.01" label="Time" />
        <input type="range" min="0" max="1" step="0.01" label="Feedback" />
        <input type="range" min="0" max="1" step="0.01" label="Tone" />
        <input type="range" min="0" max="1" step="0.01" label="Dry/Wet" />
      </div>
    </ControlGroup>
  );
};

const Reverb = () => {
  return (
    <ControlGroup title="Reverb">
      <div className="grid grid-cols-2 gap-4">
        <input type="range" min="0" max="1" step="0.01" label="Depth" />
        <input type="range" min="0" max="1" step="0.01" label="Intensity" />
      </div>
    </ControlGroup>
  );
};

const EQ = () => {
  return (
    <ControlGroup title="EQ">
      <div className="grid grid-cols-4 gap-4">
        <input type="range" min="20" max="20000" step="1" label="Low Cut" />
        <input type="range" min="20" max="20000" step="1" label="Low Shelf" />
        <input type="range" min="20" max="20000" step="1" label="Bell 1" />
        <input type="range" min="20" max="20000" step="1" label="Bell 2" />
        {/* Add more EQ bands as needed */}
      </div>
    </ControlGroup>
  );
};

exports = { ADSR, Delay, Reverb, EQ };
