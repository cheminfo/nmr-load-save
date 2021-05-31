import { fromJCAMP } from 'nmr-parser';

import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';


interface Molecule {
  molfile: string;
}

type Text = Uint8Array | string;

export function readJcamp(text: Text, options: Partial<Options> = {}): Output {
  let output: any = { spectra: [], molecules: [] };

  let spectra = fromJCAMP(
    typeof text === 'object' ? text : Buffer.from(text, 'utf8'),
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
