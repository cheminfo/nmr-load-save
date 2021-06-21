import type { Spectrum1D, Spectrum2D } from 'cheminfo-types';

interface Output {
  spectra: Array<Spectrum1D | Spectrum2D>;
  molecules: Array<any>;
}
