import { Signal1D } from '../Signal1D';

export interface Range {
  id: string;
  from: number;
  to: number;
  absolute: number;
  integral: number;
  kind: string;
  signal: Array<Signal1D>;
}
