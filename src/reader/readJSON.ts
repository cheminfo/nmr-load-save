import { JcampParsingOptions } from '../../types/Options/JcampParsingOptions';
import { Options } from '../../types/Options/Options';
import { Output } from '../../types/Output';
import { formatSpectrum1D } from '../utilities/formatSpectrum1D';
import { formatSpectrum2D } from '../utilities/formatSpectrum2D';

import { readJcampFromURL } from './readJcamp';

type Text = string;

export async function readJSON(text: Text, options: Options = {}): Promise<Output> {
  let output: any = { spectra: [], molecules: [] };

  const data = JSON.parse(text.toString());

  const spectra = output.spectra;
  let promises = [];

  for (let datum of data.spectra) {
    if (datum.source.jcampURL != null) {
      const { jcampParsingOptions } = options;
      promises.push(
        addJcampFromURL(spectra, datum.source.jcampURL, jcampParsingOptions),
      );
    } else {
      const { dimension } = datum.info;
      if (dimension === 1) {
        spectra.push(formatSpectrum1D(datum));
      } else if (dimension === 2) {
        spectra.push(formatSpectrum2D(datum));
      }
    }
  }
  await Promise.all(promises);
  return { ...data, ...{ spectra }};
}

async function addJcampFromURL(spectra: any, jcampURL: any, options?: JcampParsingOptions) {
  const result = await readJcampFromURL(jcampURL, options);
  if (result) {
    for (let spectrum of result.spectra) {
      spectra.push(spectrum);
    }
  }
}
