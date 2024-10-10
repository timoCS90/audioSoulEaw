// /app/components/StepSequencer/types.ts

export interface Instrument {
  id: number;
  name: string;
  color: string;
  sample: string;
}

export interface Preset {
  name: string;
  pattern: boolean[][];
}

export interface Sample {
  name: string;
  url: string;
}
