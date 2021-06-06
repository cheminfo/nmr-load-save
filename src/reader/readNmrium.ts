import { Output } from '../../types/Output';
import { formatSpectra } from '../utilities/formatSpectra';

export function readNmrium(text: string): Output {
  let data = JSON.parse(text);
  return formatSpectra(data);
}
