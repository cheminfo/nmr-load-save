interface filesTypes {
  [key: string]: string
}

export const FILES_TYPES: filesTypes = {
  MOL: 'mol',
  NMRIUM: 'nmrium',
  JSON: 'json',
  DX: 'dx',
  JDX: 'jdx',
  JDF: 'jdf',
  ZIP: 'zip',
  NMREDATA: 'nmredata',
};

export const FILES_SIGNATURES = {
  ZIP: '504b0304',
};
