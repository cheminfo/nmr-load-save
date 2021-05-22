import JSZip from 'jszip';

import { LoadFilesFromZip } from './types/LoadFilesFromZip';
import { LoadFilesFromZipOptions } from './types/LoadFilesFromZipOptions';

export function getFileExtension(name: string): string {
  return name.replace(/^.*\./, '').toLowerCase();
}

export async function loadFilesFromZip(
  files: JSZip.JSZipObject[],
  options: LoadFilesFromZipOptions = {},
): Promise<LoadFilesFromZip[]> {
  const result: LoadFilesFromZip[] = [];
  for (const file of files) {
    try {
      const binary = await file.async(options.asBuffer ? 'uint8array' : 'text');
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