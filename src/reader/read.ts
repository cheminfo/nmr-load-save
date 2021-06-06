import JSZip from 'jszip';

import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { FILES_TYPES, FILES_SIGNATURES } from '../utilities/files/constants';
import { getFileExtension } from '../utilities/files/getFileExtension';
import { getFileSignature } from '../utilities/files/getFileSignature';
import { loadFilesFromZip } from '../utilities/files/loadFilesFromZip';
import { isString } from '../utilities/tools/isString';

import { readJcamp } from './readJcamp';
import { readNMReData } from './readNMReData';
import { readNmrium } from './readNmrium';
import { readZip } from './readZip';
// import { readJDF } from './readJDF';

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
  const { extension = getFileExtension(file.name) } = file;
  switch (extension) {
    case FILES_TYPES.MOL:
      return { molecules: [{ molfile: file.binary }], spectra: [] };
    case FILES_TYPES.JDX:
    case FILES_TYPES.DX:
      return readJcamp(file.binary, options);
    // case FILES_TYPES.JDF:
    //   if (typeof file.binary !== 'string') {
    //     return { spectra: [readJDF(file.binary, { file.name, ...options })] };
    //   }
    //   break;
    case FILES_TYPES.ZIP:
      return readZip(file.binary, options);
    case FILES_TYPES.NMREDATA:
      return readNMReData(file, options);
    case FILES_TYPES.NMRIUM:
    case FILES_TYPES.JSON:
      const { binary } = file;

      if (!isString(binary)) {
         const fileSignature = getFileSignature(binary);
        if (fileSignature === FILES_SIGNATURES.ZIP) {
          const { base64 } = options;
          const unzipResult = await JSZip.loadAsync(binary, { base64 });
          const files = await loadFilesFromZip(Object.values(unzipResult.files));
          return process(files[0], options);
        } else {
          const decoder = new TextDecoder('utf8');
          return readNmrium(decoder.decode(binary));
        }
      } else {
        return readNmrium(binary);
      }
    default:
      throw new Error(`The extension ${extension} is not supported`);
  }
}
