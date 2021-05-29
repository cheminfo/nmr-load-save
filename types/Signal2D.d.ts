import { Signal } from './Signal';

export interface Signal2D extends Signal {
  sign: number;
  x: {
    delta: number;
    diaID?: Array<string>;
  };
  y: {
    delta: number;
    diaID?: Array<string>;
  };
}
