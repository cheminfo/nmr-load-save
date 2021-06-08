interface diaID {
  [index: number]: string | number;
  label: string;
  diaID: string;
  shift: number;
}

export interface ByAssignNumber {
  [key: string]: diaID
}
