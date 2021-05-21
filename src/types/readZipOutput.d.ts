import { Spectrum1D, Spectrum2D, Molecule } from 'cheminfo-types';

interface readZipOutput {
  spectra: Array<Spectrum1D | Spectrum2D>;
  molecules: Array<Molecule>;
}
