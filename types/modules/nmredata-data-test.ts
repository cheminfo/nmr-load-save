interface Nmredata {
  [index: string]: BufferSource | Uint8Array;
}

declare module 'nmredata-data-test' {
  const nmredata: Nmredata;
}
