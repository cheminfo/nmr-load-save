import { LoadedFiles } from '../../../types/LoadedFiles';
import { isString } from '../tools/isString';

export function getFileSignature(file: ArrayBuffer) {
  let input = isString(file) ? Buffer.from(file) : file;
  return new Uint8Array(input)
    .slice(0, 4)
    .reduce((acc, byte) => (acc += byte.toString(16).padStart(2, '0')), '');
}


