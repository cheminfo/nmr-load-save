import { ByDiaID } from './ByDiaID';
import { ByAssignNumber } from './ByAssignNumber';
export interface GetLabelsOutput {
  [index: string]: ByDiaID | ByAssignNumber;
  byDiaID: ByDiaID;
  byAssignNumber: ByAssignNumber
}