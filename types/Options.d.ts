export interface Options {
  base64?: boolean;
  shiftX?: number;
  shift?: { x: number, y: number };
  info?: any;
  name?: string;
  noContour?: boolean;
  xy?: boolean;
  keepRecordsRegExp?: RegExp;
  profiling?: boolean;
}
