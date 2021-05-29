import type { InputType } from 'jszip';
import { fromBruker } from 'nmr-parser';
import { formatSpectra } from '../utils/formatSpectra';
import { Output } from '../../types/Output';
import { Options } from '../../types/Options';


export async function readBrukerZip(
  zip: Partial<InputType>,
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
