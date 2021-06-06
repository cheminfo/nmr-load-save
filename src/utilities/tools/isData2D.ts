import { Data1D } from '../../../types/Data1D';
import { Data2D } from '../../../types/Data2D';

export function isData2D(data: Data1D|Data2D): data is Data2D {
  return (data as Data2D).z !== undefined;
}
