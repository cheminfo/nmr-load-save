// import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import { Spectrum1D } from '../../types/Spectrum1D';
import { Spectrum2D } from '../../types/Spectrum2D';
const JSZip = require('jszip');

import { getFileExtension, loadFiles } from '../fileUtility';
import { formatSpectra } from '../utils/formatSpectra';
import { LoadedFiles } from '../../types/LoadedFiles';
import { Output } from '../../types/Output';
import { Options } from '../../types/Options';
import { FILES_TYPES } from '../utility';

import { readBrukerZip } from './readBrukerZip';
import { readByExtension } from './readByExtension';

import type { InputType } from 'jszip';

export async function readZip(
  zipFile: Partial<InputType>,
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
    let partialResult: Output = await readBrukerZip(zipFile, options);
    if (partialResult.spectra) result.spectra.push(...partialResult.spectra);
  }

  let hasOthers = uniqueFileExtensions.some((ex) => FILES_TYPES[ex]);

  if (hasOthers) {
    for (let extension of uniqueFileExtensions) {
      const selectedFilesByExtensions = zip.filter(
        (file: any) => getFileExtension(file.name) === extension,
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
  return formatSpectra(result);
}
