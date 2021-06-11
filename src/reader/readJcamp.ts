import { fromJCAMP } from 'nmr-parser';

import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';

type Text = string | ArrayBuffer;
export function readJcamp(text: Text, options: Partial<Options> = {}): Output {
  let output: any = { spectra: [], molecules: [] };

  let spectra = fromJCAMP(
    text,
    {
      ...{
        noContour: true,
        xy: true,
        keepRecordsRegExp: /.*/,
        profiling: true,
      },
      ...options,
    },
  );

  output.spectra.push(...spectra);

  return formatSpectra(output);
}

export function readJcampFromURL(jcampURL: string, options: Options): Promise<Output> {
  return fetch(jcampURL)
    .then((response) => response.arrayBuffer())
    .then((jcamp) => readJcamp(jcamp, options));
}