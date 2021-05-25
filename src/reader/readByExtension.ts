import { Output } from '../types/Output';
import { Options } from '../types/Options';
import { LoadedFiles } from '../types/LoadedFiles';
import { getFileExtension } from '../fileUtility';
import { readZip } from './readZip';
import { readJDF } from './readJDF';
import { readText } from './readText';
import { FILES_TYPES } from '../utility';

export async function readByExtension(files: LoadedFiles[], options: Partial<Options>) {
  let result: Output = { spectra: [], molecules: [] };
  for (let file of files) {
    const extension = getFileExtension(file.name);
    switch (extension) {
      case FILES_TYPES.MOL:
        result.molecules.push(readText(file.binary));
        break;
      case FILES_TYPES.JDX:
      case FILES_TYPES.DX:
        result.spectra.push(readText(file.binary, options));
        break;
      case FILES_TYPES.JDF:
        let { name, binary } = file;
        if (typeof binary !== 'string') {
          result.spectra.push(readJDF(binary, { name, ...options }));
        }
        break;
      case FILES_TYPES.ZIP:
        let partialResult = await readZip(file.binary, options);
        result.spectra.push(...partialResult.spectra);
        result.molecules.push(...partialResult.molecules);
      default:
        break;
    }
  }
  return result;
}
