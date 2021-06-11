interface Bruker {
  [index: string]: string;
  "aspirin-1h.zip": string;
}
declare module 'bruker-data-test' {
  const bruker: Bruker;
}
