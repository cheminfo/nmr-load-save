import JSZip from 'jszip';

import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options/Options';
import { Output } from '../../types/Output';
import { FILES_TYPES } from '../utilities/files/constants';
import { getFileExtension } from '../utilities/files/getFileExtension';
import { loadFilesFromZip } from '../utilities/files/loadFilesFromZip';

import { read } from './read';
import { readBrukerZip } from './readBrukerZip';

export async function readZip(
  zipFile: string | ArrayBuffer,
  options: Options = {},
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
    const { brukerParsingOptions } = options;
    let partialResult: Output = await readBrukerZip(
      zipFile,
      {
        base64,
        ...brukerParsingOptions,
      }
    );
    if (partialResult.spectra) result.spectra.push(...partialResult.spectra);
  }

  let hasOthers = uniqueFileExtensions.some(
    (ex) => FILES_TYPES[ex.toUpperCase()],
  );

  if (hasOthers) {
    const zipFiles: Array<any> = Object.values(zip.files);
    const selectedFilesByExtensions = zipFiles.filter((file: any) =>
      FILES_TYPES[getFileExtension(file.name).toUpperCase()],
    );
    let files: LoadedFiles[] = await loadFilesFromZip(
      selectedFilesByExtensions,
    );
    let partialResult: Output = await read(files, options);
    result.spectra.push(...partialResult.spectra);
    result.molecules.push(...partialResult.molecules);
  }

  return result;
}
