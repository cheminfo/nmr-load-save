declare module jszip {
  function loadAsync(
    zip: Uint8Array | string,
    options: any,
  ): Promise<any>
}