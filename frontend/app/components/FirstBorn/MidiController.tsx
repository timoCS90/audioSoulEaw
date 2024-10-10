import React, { useEffect, useState } from "react";

interface MidiControllerProps {
  setOsc1Frequency: (value: number) => void;
  setOsc2Frequency: (value: number) => void;
  setOsc3Frequency: (value: number) => void;
  setVolume: (value: number) => void;
}

const MidiController: React.FC<MidiControllerProps> = ({
  setOsc1Frequency,
  setOsc2Frequency,
  setOsc3Frequency,
  setVolume,
}) => {
  const [midiDevices, setMidiDevices] = useState<string[]>([]);

  const onMidiSuccess = (midiAccess: WebMidi.MIDIAccess) => {
    const inputs = Array.from(midiAccess.inputs.values());
    setMidiDevices(inputs.map((input) => input.name || "Unknown Device"));

    inputs.forEach((input) => (input.onmidimessage = handleMidiMessage));
  };
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMidiSuccess, onMidiFailure);
    } else {
      console.error("MIDI not supported in this browser.");
    }
  }, [onMidiSuccess]);

  const onMidiFailure = () => {
    console.error("Could not access your MIDI devices.");
  };

  const handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [status, data1, data2] = message.data;

    if (status === 144) {
      // Note On event
      handleNoteOn(data1, data2);
    } else if (status === 176) {
      // Control Change event
      handleControlChange(data1, data2);
    }
  };

  const handleNoteOn = (note: number, velocity: number) => {
    const freq = midiNoteToFrequency(note);
    setOsc1Frequency(freq); // Map note to Oscillator 1 frequency
  };

  const handleControlChange = (controller: number, value: number) => {
    const normalizedValue = value / 127;

    switch (controller) {
      case 1:
        setVolume(normalizedValue); // Map CC1 to volume
        break;
      case 2:
        setOsc2Frequency(normalizedValue * 1000 + 100); // Map CC2 to Oscillator 2 frequency
        break;
      case 3:
        setOsc3Frequency(normalizedValue * 1000 + 100); // Map CC3 to Oscillator 3 frequency
        break;
      default:
        console.log("Unhandled Control Change:", controller);
    }
  };

  const midiNoteToFrequency = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12); // Convert MIDI note to frequency
  };

  return (
    <div>
      <h3>Connected MIDI Devices</h3>
      <ul>
        {midiDevices.map((device, index) => (
          <li key={index}>{device}</li>
        ))}
      </ul>
    </div>
  );
};

export default MidiController;
