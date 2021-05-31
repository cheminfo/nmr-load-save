import { Display } from '../Display';
import { Source } from '../Source';

export interface Spectrum {
  id: string | number;
  source: Partial<Source>;
  display: Partial<Display>;
  meta: any;
}
