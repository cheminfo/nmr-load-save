import { Spectrum1D, Spectrum2D } from 'cheminfo-types';

export function isSpectrum2D(spectrum: Spectrum1D | Spectrum2D ): spectrum is Spectrum2D {
  return (spectrum as Spectrum2D).zones !== undefined;
}
