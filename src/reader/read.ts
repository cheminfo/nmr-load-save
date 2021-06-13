import JSZip from 'jszip';

import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options/Options';
import { Output } from '../../types/Output';
import { FILES_TYPES, FILES_SIGNATURES } from '../utilities/files/constants';
import { getFileExtension } from '../utilities/files/getFileExtension';
import { getFileSignature } from '../utilities/files/getFileSignature';
import { loadFilesFromZip } from '../utilities/files/loadFilesFromZip';
import { isString } from '../utilities/tools/isString';

import { readJDF } from './readJDF';
import { readJSON } from './readJSON';
import { readJcamp } from './readJcamp';
import { readNMReData } from './readNMReData';
import { readZip } from './readZip';

/**
 * read nmr data based on the file extension
 * @param files {Array<Object>} - List of objects
 * @param options
 * @returns
 */

export async function read(
  files: LoadedFiles[] | LoadedFiles,
  options: Partial<Options> = {},
): Promise<Output> {
  let result: any = { spectra: [], molecules: [] };

  files = !Array.isArray(files) ? [files] : files;

  for (let file of files) {
    const { spectra = [], molecules = [] } = await process(file, options);
    result.spectra.push(...spectra);
    result.molecules.push(...molecules);
  }
  return result;
}

async function process(
  file: LoadedFiles,
  options: Partial<Options>,
): Promise<Output> {
  const { jcampParsingOptions } = options;
  const { extension = getFileExtension(file.name), binary } = file;
  switch (extension) {
    case FILES_TYPES.MOL:
      return { molecules: [{ molfile: binary }], spectra: [] };
    case FILES_TYPES.JDX:
    case FILES_TYPES.DX:
    case FILES_TYPES.JCAMP:
      return readJcamp(binary, jcampParsingOptions);
    case FILES_TYPES.JDF:
      if (typeof file.binary !== 'string') {
        return readJDF(file.binary, { name: file.name });
      } else {
        throw new Error('The jdf binary should be an ArrayBuffer');
      }
    case FILES_TYPES.ZIP:
      return readZip(binary, options);
    case FILES_TYPES.NMREDATA:
      return readNMReData(file, options);
    case FILES_TYPES.NMRIUM:
    case FILES_TYPES.JSON:
      if (!isString(binary)) {
         const fileSignature = getFileSignature(binary);
        if (fileSignature === FILES_SIGNATURES.ZIP) {
          const unzipResult = await JSZip.loadAsync(binary);
          const files = await loadFilesFromZip(Object.values(unzipResult.files));
          return process(files[0], options);
        } else {
          const decoder = new TextDecoder('utf8');
          return readJSON(decoder.decode(binary));
        }
      } else {
        return readJSON(binary);
      }
    default:
      throw new Error(`The extension ${extension} is not supported`);
  }
}
