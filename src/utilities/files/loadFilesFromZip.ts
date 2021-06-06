import type { JSZipObject } from 'jszip';

import { LoadFilesFromZipOptions } from '../../../types/LoadFilesFromZipOptions';
import { LoadedFiles } from '../../../types/LoadedFiles';

import { getFileExtension } from './getFileExtension';
import { getFileName } from './getFileName';

type Binary = Uint8Array | string;

export async function loadFilesFromZip(
  files: JSZipObject[],
  options: LoadFilesFromZipOptions = {},
): Promise<LoadedFiles[]> {
  const result: LoadedFiles[] = [];
  for (const file of files) {
    try {
      const binary: Binary = await file.async(options.asBuffer ? 'uint8array' : 'text');
      const name = getFileName(file.name);
      const extension = getFileExtension(file.name);
      result.push({ binary, name, extension });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
  return result;
}
