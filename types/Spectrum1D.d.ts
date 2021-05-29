import { Data1D } from './Data1D';
import { Integrals } from './Integrals';
import { Peaks } from './Peaks';
import { Ranges } from './Ranges';
import { Spectrum } from './Spectrum';

export interface Spectrum1D extends Spectrum {
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
