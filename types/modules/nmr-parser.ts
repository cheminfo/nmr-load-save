declare module 'nmr-parser' {
  interface Options {
    base64?: boolean;
    shiftX?: number;
    info?: any;
    name?: string;
  }

  function fromBruker(
    zipFile: Uint8Array | string,
    options: Partial<Options>,
  ): Array<any>;
  
  function fromJCAMP(
    buffer: Uint8Array,
    options?: any, 
  ): Array<any>;

  function fromJEOL(
    buffer: Uint8Array
  ): any;
}
