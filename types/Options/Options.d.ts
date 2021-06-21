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
