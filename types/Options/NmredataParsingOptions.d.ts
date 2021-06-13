import { BrukerParsingOptions } from "./BrukerParsingOptions";
import { JcampParsingOptions } from "./JcampParsingOptions";


export interface NmredataParsingOptions {
  base64?: boolean;
  brukerParsingOptions?: BrukerParsingOptions;
  jcampParsingOptions?: JcampParsingOptions;
}