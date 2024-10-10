export interface Preset {
  name: string;
  playbackRate: number;
  filterFrequency: number;
  distortion: number;
  delay: number;
  reverb: number;
}

export const presets: Preset[] = [
  {
    name: "Deep Bass",
    playbackRate: 0.5,
    filterFrequency: 500,
    distortion: 20,
    delay: 0.2,
    reverb: 0.3,
  },
  {
    name: "Neuro Bass",
    playbackRate: 1.2,
    filterFrequency: 2000,
    distortion: 50,
    delay: 0.1,
    reverb: 0.1,
  },
  {
    name: "Wobble Bass",
    playbackRate: 0.8,
    filterFrequency: 1000,
    distortion: 30,
    delay: 0.3,
    reverb: 0.2,
  },
  {
    name: "Growl Bass",
    playbackRate: 1.5,
    filterFrequency: 3000,
    distortion: 40,
    delay: 0.15,
    reverb: 0.15,
  },
];
