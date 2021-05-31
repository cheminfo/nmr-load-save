import { Signal } from './Signal';
import { Peak2D } from '../Peaks/Peak2D';

interface SignalAxis {
  delta: number;
  diaID?: Array<string>;
  originDelta: number;
}

export interface Signal2D extends Signal {
  [index: string]: string | number | SignalAxis | Array<Peak2D> | undefined;
  sign?: number;
  x: SignalAxis;
  y: SignalAxis;
  peak?: Peak2D[];
}
