import { Info } from './Info';

export interface Info2D extends Info {
  nucleus: Array<string>;
  baseFrequency: Array<number>;
  experiment?: string;
  pulseSequence?: string;
}
