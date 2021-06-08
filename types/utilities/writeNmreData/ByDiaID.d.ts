interface diaID {
  [index: string]: string | number | Array<number>;
  label: string;
  atoms: Array<number>;
  shift: number;
}

export interface ByDiaID {
  [key: string]: diaID
}
