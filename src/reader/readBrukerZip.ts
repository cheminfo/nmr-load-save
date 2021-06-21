import { fromBruker } from 'nmr-parser';


import type { BrukerParsingOptions } from '../../types/Options/BrukerParsingOptions';
import type { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';

export async function readBrukerZip(
  zip: string | ArrayBuffer,
  options: BrukerParsingOptions = {},
): Promise<Output> {
  let output: any = { spectra: [], molecules: [] };

  const entries = await fromBruker(zip, {
    ...{
      noContour: true,
      xy: true,
      keepRecordsRegExp: /.*/,
      profiling: true,
    },
    ...options,
  });

  for (let entry of entries) {
    const { dependentVariables, info, meta, source } = entry;
    output.spectra.push({ dependentVariables, meta, info, source });
  }

  return formatSpectra(output);
}
