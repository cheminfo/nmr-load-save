import { Spectrum2D } from '../../types/Spectra/Spectrum2D';

import generateID from './generateID';

export function formatSpectrum2D(options: any): Spectrum2D {
  const {
    id = generateID(),
    meta = {},
    dependentVariables = [],
    info = {},
    source = {},
    filters = [],
    zones = [],
  } = options;

  const spectrum: any = { id, meta, filters };

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

  let { data = dependentVariables[0].components } = options;

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
