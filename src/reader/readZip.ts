import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { FILES_TYPES } from '../utilities/files/constants';
import { getFileExtension } from '../utilities/files/getFileExtension';
import { loadFilesFromZip } from '../utilities/files/loadFilesFromZip';

import { read } from './read';
import { readBrukerZip } from './readBrukerZip';

const JSZip = require('jszip');

export async function readZip(
  zipFile: BufferSource | string | Uint8Array,
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
      let files: LoadedFiles[] = await loadFilesFromZip(selectedFilesByExtensions, {
        asBuffer: extension === FILES_TYPES.MOL ? false : true,
      });
      let partialResult: Output = await read(files, options);
      result.spectra.push(...partialResult.spectra);
      result.molecules.push(...partialResult.molecules);
    }
  }

  return result;
}
