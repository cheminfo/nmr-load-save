import { Display } from '../Display';
import { Source } from '../Source';

export interface Spectrum {
  id: string | number;
  source: Source;
  display: Display;
  meta: any;
}
