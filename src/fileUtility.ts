import type { JSZipObject } from 'jszip';
import { LoadedFiles } from '../types/LoadedFiles';
import { LoadFilesFromZipOptions } from '../types/LoadFilesFromZipOptions';

export function getFileExtension(name: string): string {
  return name.replace(/^.*\./, '').toLowerCase();
}

export async function loadFiles(
  files: JSZipObject[],
  options: LoadFilesFromZipOptions = {},
): Promise<LoadedFiles[]> {
  const result: LoadedFiles[] = [];
  for (const file of files) {
    try {
      const binary: Uint8Array = await file.async('uint8array');
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
