import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import { fromJcamp } from 'nmr-parser';

import { Options } from '../types/Options';

interface Molecule {
  molfile: string;
}
export type ReadTextOutput = Array<Spectrum1D | Spectrum2D> | Molecule;
export type Text = ArrayBuffer | string;

export function readText(text: Text, options: Partial<Options> = {}): ReadTextOutput {
  const inputString = typeof text === 'object' ? text.toString() : text.slice();
  if (inputString.includes('##title')) {
    return fromJcamp(inputString, {
      ...{
        noContour: true,
        xy: true,
        keepRecordsRegExp: /.*/,
        profiling: true,
      },
      ...options,
    });
  } else if (inputString.includes('v2000') || inputString.includes('v3000')) {
    return { molfile: inputString };
  } else {
    throw new Error(
      'The input should be ArrayBuffer or String of a jcamp file or molfile',
    );
  }
}
