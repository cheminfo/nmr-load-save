import { Spectrum2D } from 'cheminfo-type';

import generateID from './utils/generateID';

export function formatSpectrum2D(options: any) {
  const {
    id = generateID(),
    meta = {},
    data = {},
    info = {},
    source = {},
    filters = [],
    zones = [],
  } = options;

  const spectrum: Spectrum2D = { id, meta, filters };

  spectrum.source = {
    ...{
      jcampURL: null,
      file: {
        binary: null,
        name: '',
        extension: '',
      },
    },
    ...source,
  };

  spectrum.info = {
    ...{
      nucleus: ['1H', '1H'],
      isFid: false,
      isComplex: false, // if isComplex is true that mean it contains real/ imaginary  x set, if not hid re/im button .
    },
    ...info,
  };

  spectrum.originalInfo = spectrum.info;
  spectrum.data = {
    ...{
      z: [],
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    },
    ...data,
  };
  spectrum.originalData = spectrum.data;

  spectrum.zones = { ...{ values: [], options: {} }, ...zones };

  return spectrum;
}
