import { Data1D, Data2D } from 'cheminfo-types';

export function isData2D(data: Data1D|Data2D): data is Data2D {
  return (data as Data2D).z !== undefined;
}
