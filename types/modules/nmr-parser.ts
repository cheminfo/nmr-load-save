declare module 'nmr-parser' {
  interface Options {
    base64?: boolean;
    shiftX?: number;
    info?: any;
    name?: string;
  }

  function fromBruker(
    zipFile: ArrayBuffer | string,
    options: Partial<Options>,
  ): Promise<Array<any>>;
  
  function fromJCAMP(
    buffer: string | ArrayBuffer,
    options?: any, 
  ): Array<any>;

  function fromJEOL(
    buffer: ArrayBuffer,
  ): any;
}
