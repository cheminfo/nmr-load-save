import { LoadedFiles } from '../../types/LoadedFiles';
import { Options } from '../../types/Options';
import { Output } from '../../types/Output';
import { getFileExtension } from '../fileUtility';
import { FILES_TYPES } from '../utility';

import { readJcamp } from './readJcamp';
import { readZip } from './readZip';
// import { readJDF } from './readJDF';

export async function readByExtension(
  files: LoadedFiles[],
  options: Partial<Options>,
): Promise<Output> {
  let result: any = { spectra: [], molecules: [] };
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
      return { molecules: [{ molfile: file.binary }], spectra: []};
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
    default:
      throw new Error(`The extension ${extension} is not supported`);
  }
}
