import { Peak } from './Peak';

export interface Peak1D extends Peak {
  x: number;
  y: number;
  originX?: number;
  originY?: number;
  width?: number;
  mu?: number;
}
