import { ObjectXY } from './ObjectXY';

export interface Options {
  base64?: boolean;
  shiftX?: number;
  shift?: ObjectXY;
  info?: any;
  name?: string;
  noContours?: boolean;
  keepOriginal?: boolean;
  jcampURL?: string;
  xy?: boolean;
  keepRecordsRegExp?: RegExp;
  profiling?: boolean;
}
