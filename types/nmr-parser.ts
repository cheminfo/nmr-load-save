declare module 'nmr-parser' {
  import type { InputType } from 'jszip';

  interface Options {
    base64?: boolean;
    shiftX?: number;
    info?: any;
    name?: string;
  }

  function fromBruker(
    zipFile: InputType,
    options: Partial<Options>,
  ): Array<any>;
  
  function fromJcamp(
    buffer: Uint8Array,
    options?: any, 
  ): Array<any>;

  function fromJEOL(
    buffer: Uint8Array
  ): any;
}
