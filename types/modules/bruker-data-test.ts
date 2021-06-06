interface Bruker {
  [index: string]: BufferSource | Uint8Array;
  "aspirin-1h.zip": BufferSource | Uint8Array;
}
declare module 'bruker-data-test' {
  const bruker: Bruker;
}
