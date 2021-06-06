declare module jszip {
  function loadAsync(
    zip: string | ArrayBuffer,
    options: any,
  ): Promise<any>
}