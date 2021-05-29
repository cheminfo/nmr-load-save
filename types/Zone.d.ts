import { Signal2D } from './Signal2D';

export interface Zone {
  id: string;
  signal: Array<Signal2D>;
  kind: string;
}
