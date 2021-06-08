import { Jcouplings } from '../Jcouplings';
import { Signal } from './Signal';

export interface Signal1D extends Signal {
  delta: number;
  diaID: Array<string>;
  originDelta?: number;
  multiplicity: string;
  j: Jcouplings
  peak?: Array<Partial<{ x: number; intensity: number; width: number }>>;
}
