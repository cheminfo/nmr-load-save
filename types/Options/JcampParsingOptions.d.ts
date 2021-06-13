import { Source } from "../Source";

export interface JcampParsingOptions {
  name?: string;
  source?: Source;
  noContours?: boolean;
  xy?: boolean;
  keepRecordsRegExp?: RegExp;
  profiling?: boolean;
}
