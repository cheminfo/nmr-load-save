import { Info2D } from '../Info/Info2D';
import { Spectrum } from './Spectrum';
import { Zones } from '../Zones/Zones';
import { Data2D } from '../Data2D';

export interface Spectrum2D extends Spectrum {
  [index: string]: Zones | Array<any> | any | Data2D | Partial<Info2D>;
  zones: Zones;
  meta: any;
  filters: Array<any>;
  data: Data2D;
  info: Partial<Info2D>;
  originalInfo?: Partial<Info2D>;
  originalData: Data2D; 
}
