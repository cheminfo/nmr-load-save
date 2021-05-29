import { Integral } from './Integral';

export interface Integrals {
  values: Array<Partial<Integral>>;
  options: Partial<{ sum: number }>;
}
