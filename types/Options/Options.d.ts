import { ObjectXY } from '../ObjectXY';
import { BrukerParsingOptions } from './BrukerParsingOptions';
import { JcampParsingOptions } from './JcampParsingOptions';
import { NmredataParsingOptions } from './NmredataParsingOptions';

export interface Options {
  name?: string;
  base64?: true;
  jcampParsingOptions?: JcampParsingOptions;
  brukerParsingOptions?: BrukerParsingOptions;
  nmredataParsingOptions?: NmredataParsingOptions;
}

// export interface Options {
//   base64?: boolean;
//   shiftX?: number;
//   shift?: ObjectXY;
//   info?: any;
//   name?: string;
//   noContours?: boolean;
//   keepOriginal?: boolean;
//   jcampURL?: string;
//   xy?: boolean;
//   keepRecordsRegExp?: RegExp;
//   profiling?: boolean;
// }