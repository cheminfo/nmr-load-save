// import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import { Output } from '../../types/Output';
import { Spectrum1D } from '../../types/Spectrum1D';
import { Spectrum2D } from '../../types/Spectrum2D';
import { formatSpectra } from '../utils/formatSpectra';
import { fromJcamp } from 'nmr-parser';

import { Options } from '../../types/Options';

interface Molecule {
  molfile: string;
}

type Text = Uint8Array | string;

export function readText(
  text: Text,
  options: Partial<Options> = {},
): Output {
  let output: any = { spectra: [], molecules: [] };

  const inputString = typeof text === 'object' ? text.toString() : text.slice();

  if (inputString.includes('##title')) {
    let spectra = fromJcamp(
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
    output.spectra(...spectra);
  } else if (inputString.includes('v2000') || inputString.includes('v3000')) {
    output.molecules.push({ molfile: inputString });
  } else {
    throw new Error(
      'The input should be ArrayBuffer or String of a jcamp file or molfile',
    );
  }

  return formatSpectra(output);
}
