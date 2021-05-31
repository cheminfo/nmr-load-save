declare module 'ml-spectra-processing' {
  function xyIntegration(
    fromTo: {
      x: Array<number>,
      y: Array<number>
    },
    options: {
      from: number,
      to: number,
      reverse: boolean,
    }
  ): number;
}