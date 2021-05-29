import { formatSpectrum1D } from './formatSpectrum1D';
import { formatSpectrum2D } from './formatSpectrum2D';
import { Output } from '../../types/Output';

export function formatSpectra(input: any): Output {
  const { spectra: inputSpectra = [], molecules } = input;
  let spectra = [];
  for (let spectrum of inputSpectra) {
    const { info } = spectrum;
    switch (info.dimension) {
      case 'MONO_DIMENSIONAL':
        spectra.push(formatSpectrum1D(spectrum));
        break;
      case 'BI_DIMENSIONAL':
        spectra.push(formatSpectrum2D(spectrum));
        break;
    }
  }
  return { molecules, spectra };
}
