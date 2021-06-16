import type { JSZipObject } from 'jszip';

import { LoadedFiles } from '../../../types/LoadedFiles';

import { FILES_TYPES } from './constants';
import { getFileExtension } from './getFileExtension';
import { getFileName } from './getFileName';

type Binary = Uint8Array | string;

interface LoadFilesFromZipOptions {
  asBuffer?: boolean;
}

export async function loadFilesFromZip(
  files: JSZipObject[],
  options: LoadFilesFromZipOptions = {},
): Promise<LoadedFiles[]> {
  const result: LoadedFiles[] = [];
  for (const file of files) {
    try {
      const name = getFileName(file.name);
      const extension = getFileExtension(file.name);
      const { asBuffer = extension !== FILES_TYPES.MOL } = options;
      const binary: Binary = await file.async(asBuffer ? 'uint8array' : 'text');
      result.push({ binary, name, extension });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
  return result;
}
