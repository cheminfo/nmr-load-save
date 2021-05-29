import { Signal } from './Signal';

export interface Signal1D extends Signal {
  delta: number;
  originDelta?: number;
  multiplicity: string;
  peak?: Array<Partial<{ x: number; intensity: number; width: number }>>;
}
