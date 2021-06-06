declare module 'nmr-parser' {
  interface Options {
    base64?: boolean;
    shiftX?: number;
    info?: any;
    name?: string;
  }

  function fromBruker(
    zipFile: BufferSource | string | Uint8Array,
    options: Partial<Options>,
  ): Promise<Array<any>>;
  
  function fromJCAMP(
    buffer: BufferSource | Uint8Array,
    options?: any, 
  ): Array<any>;

  function fromJEOL(
    buffer: BufferSource | Uint8Array
  ): any;
}
