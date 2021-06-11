import { fromBruker } from 'nmr-parser';

import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';


export async function readBrukerZip(
  zip: string | ArrayBuffer,
  options: Partial<Options>,
): Promise<Output> {
  const { shiftX } = options;
  let output: any = { spectra: [], molecules: [] };

  const entries = await fromBruker(zip, options);
  for (let entry of entries) {
    const { dependentVariables, info, meta, source } = entry;
    output.spectra.push({ shiftX, dependentVariables, meta, info, source });
  }
  return formatSpectra(output);
}
