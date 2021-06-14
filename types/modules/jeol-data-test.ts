interface Jeol {
  [index: string]: ArrayBuffer;
}

declare module 'jeol-data-test' {
  const experiments: Jeol;
}
