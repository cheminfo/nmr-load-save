import { Spectrum1D } from '../../../types/Spectra/Spectrum1D'
import { Spectrum2D } from '../../../types/Spectra/Spectrum2D'

export function isSpectrum2D(spectrum: Spectrum1D | Spectrum2D ): spectrum is Spectrum2D {
  return (spectrum as Spectrum2D).zones !== undefined;
}
