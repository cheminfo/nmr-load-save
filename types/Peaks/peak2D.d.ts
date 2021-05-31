import { Peak } from './Peak';

export interface Peak2D extends Peak {
  x: number;
  y: number;
  z: number;
  originX?: number;
  originY?: number;
  originZ?: number;
  width?: number | { x: number, y: number};
}