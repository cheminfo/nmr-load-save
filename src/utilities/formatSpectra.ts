import type { Output } from '../../types/Output';

import { formatSpectrum1D } from './formatSpectrum1D';
import { formatSpectrum2D } from './formatSpectrum2D';

const BI_DIMENSIONAL = 2;
const MONO_DIMENSIONAL = 1;

export function formatSpectra(input: any): Output {
  const { spectra: inputSpectra = [], molecules } = input;
  let spectra = [];
  for (let spectrum of inputSpectra) {
    const { info } = spectrum;
    switch (info.dimension) {
      case MONO_DIMENSIONAL:
        spectra.push(formatSpectrum1D(spectrum));
        break;
      case BI_DIMENSIONAL:
        spectra.push(formatSpectrum2D(spectrum));
        break;
      default:
        new Error('dimension does not supported');
    }
  }
  return { molecules, spectra };
}
