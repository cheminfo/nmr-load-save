interface Jcamp {
  [index: string]: BufferSource | Uint8Array;
}

declare module 'jcamp-data-test' {
  const jcamp: Jcamp;
}
