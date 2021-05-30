import type { JSZipObject } from 'jszip';

import { LoadFilesFromZipOptions } from '../types/LoadFilesFromZipOptions';
import { LoadedFiles } from '../types/LoadedFiles';

export function getFileExtension(name: string): string {
  return name.replace(/^.*\./, '').toLowerCase();
}

type Bynary = Uint8Array | string;

export async function loadFiles(
  files: JSZipObject[],
  options: LoadFilesFromZipOptions = {},
): Promise<LoadedFiles[]> {
  const result: LoadedFiles[] = [];
  for (const file of files) {
    try {
      const binary: Bynary = await file.async(options.asBuffer ? 'uint8array' : 'text');
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

export function getFileName(name: string): string {
  return name.substr(0, name.lastIndexOf('.'));
}
