interface Nmredata {
  [index: string]: string | ArrayBuffer;
}

declare module 'nmredata-data-test' {
  const nmredata: Nmredata;
}
