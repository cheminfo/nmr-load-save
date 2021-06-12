import { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';
import { readJcampFromURL } from './readJcamp';

export async function readNmrium(text: string): Promise<Output> {
  let state = JSON.parse(text);
  const { spectra } = state;
  for (let i = 0; i < spectra.length; i++) {
    const spectrum = spectra[i];
    if (spectrum.source.jcampURL !== null) {
      let temp = await readJcampFromURL(spectrum.source.jcampURL);
      if (temp) {
        state.spectra[i] = { ...temp.spectra[0], ...spectrum };
      }
    }
  }

  return formatSpectra(state);
}

