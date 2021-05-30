import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { getFileExtension, loadFiles } from '../fileUtility';
import { FILES_TYPES } from '../utility';

import { readBrukerZip } from './readBrukerZip';
import { readByExtension } from './readByExtension';

const JSZip = require('jszip');

export async function readZip(
  zipFile: Uint8Array | string,
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

  let hasOthers = uniqueFileExtensions.some(
    (ex) => FILES_TYPES[ex.toUpperCase()],
  );

  if (hasOthers) {
    const zipFiles: Array<any> = Object.values(zip.files);
    for (let extension of uniqueFileExtensions) {
      if (!FILES_TYPES[extension.toUpperCase()]) continue;

      const selectedFilesByExtensions = zipFiles.filter(
        (file: any) => getFileExtension(file.name) === extension,
      );
      let files: LoadedFiles[] = await loadFiles(selectedFilesByExtensions, {
        asBuffer: extension === FILES_TYPES.MOL ? false : true,
      });
      let partialResult: Output = await readByExtension(files, options);
      result.spectra.push(...partialResult.spectra);
      result.molecules.push(...partialResult.molecules);
    }
  }

  return result;
}
