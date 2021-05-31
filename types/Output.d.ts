// import { Spectrum1D, Spectrum2D, Molecule } from 'cheminfo-types';
import { Spectrum1D } from './Spectra/Spectrum1D';
import { Spectrum2D } from './Spectra/Spectrum2D';

interface Output {
  spectra: Array<Spectrum1D | Spectrum2D>;
  molecules: Array<any>;
}
