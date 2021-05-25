import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
const JSZip = require('jszip');

import { getFileExtension, loadFiles } from '../fileUtility';
import { formatSpectrum1D } from '../formatSpectrum1D';
import { formatSpectrum2D } from '../formatSpectrum2D';
import { LoadedFiles } from '../types/LoadedFiles';
import { Output } from '../types/Output';
import { Options } from '../types/Options';
import { FILES_TYPES } from '../utility';

import { readBrukerZip } from './readBrukerZip';
import { readByExtension } from './readByExtension';
import { readText } from './readText';

import type { InputType } from 'jszip';
type Spectrum = Array<Spectrum1D | Spectrum2D>;

const MONO_DIMENSIONAL = 1;
const BI_DIMENSIONAL = 2;

export async function readZip(
  zipFile: InputType,
  options: Partial<Options> = {},
): Promise<Output> {
  const { base64 } = options;
  const jszip = new JSZip();
  let zip = await jszip.loadAsync(zipFile, { base64 });

  let result: Output = { spectra: [], molecules: [] };

  let uniqueFileExtensions: Array<string> = [];
  for (let name in zip.files) {
    let extension: string = getFileExtension(name);
    if (!uniqueFileExtensions.includes(extension)) {
      uniqueFileExtensions.push(extension);
    }
  }

  let hasBruker = Object.keys(zip.files).some((name) =>
    ['2rr', 'fid', '1r'].some((brukerFile) => name.endsWith(brukerFile)),
  );

  if (hasBruker) {
    let spectrum: Spectrum = await readBrukerZip(zipFile, options);
    if (spectrum) result.spectra.push(...spectrum);
  }

  let hasOthers = uniqueFileExtensions.some((ex) => FILES_TYPES[ex]);

  if (hasOthers) {
    for (let extension of uniqueFileExtensions) {
      const selectedFilesByExtensions = zip.filter(
        (file) => getFileExtension(file.name) === extension,
      );
      let files: LoadedFiles[] = await loadFiles(
        selectedFilesByExtensions,
        {
          asBuffer: extension === FILES_TYPES.MOL ? false : true,
        },
      );
      let partialResult: Output = await readByExtension(files, options);
      result.spectra.push(...partialResult.spectra);
      result.molecules.push(...partialResult.molecules);
    }
  }
  return formatSpectrum(result);
}

function formatSpectrum(input: Output): any {
  const { spectra: inputSpectra = [], molecules } = input;
  let spectra = [];
  for (let spectrum of inputSpectra) {
    const { info } = spectrum;
    switch (info.dimension) {
      case 'MONO_DIMENSIONAL':
        spectra.push(formatSpectrum1D(spectrum));
        break;
      case 'BI_DIMENSIONAL':
        spectra.push(formatSpectrum2D(spectrum));
        break;
    }
  }
  return { molecules, spectra };
}
