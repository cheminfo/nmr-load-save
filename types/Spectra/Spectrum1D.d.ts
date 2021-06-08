import { Data1D } from '../Data1D';
import { Integrals } from '../Integrals';
import { Peaks } from '../Peaks/Peaks';
import { Ranges } from '../Ranges/Ranges';
import { Spectrum } from './Spectrum';

export interface Spectrum1D extends Spectrum {
  [index: string]: Data1D | Peaks | Ranges | Integrals | number | any | Array<any>;
  data: Data1D;
  originalData?: Data1D;
  peaks: Peaks;
  integrals: Integrals;
  ranges: Ranges;
  shiftX: number;
  meta: any;
  info: any;
  originalInfo: any;
  filters: Array<any>;
}
