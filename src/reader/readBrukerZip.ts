import type { InputType } from 'jszip';
import { fromBruker } from 'nmr-parser';

import { formatSpectrum1D } from '../formatSpectrum1D';
import { Options } from '../types/Options';
import { getData } from '../utility';

export async function readBrukerZip(zip: InputType, options: Partial<Options>) {
  const { shiftX } = options;
  const { dependentVariables, info, meta, source } = await fromBruker(zip);

  let data = getData(dependentVariables[0].components);

  if (data.im) info.isComplex = true;
  if (Array.isArray(info.nucleus)) info.nucleus = info.nucleus[0];

  return formatSpectrum1D({ shiftX, data, meta, info, source });
}
