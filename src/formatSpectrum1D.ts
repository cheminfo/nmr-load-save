import { Data1D, Spectrum1D } from 'cheminfo-types';

export function formatSpectrum1D(options: any) {
  const {
    shiftX = 0,
    meta,
    peaks = {},
    filters = [],
    info = {},
    source = {},
    data = {},
  } = options;
  const spectrum: Spectrum1D = { shiftX, meta, filters };

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
      nucleus: '1H', // 1H, 13C, 19F, ...
      isFid: false,
      isComplex: false, // if isComplex is true that mean it contains real/ imaginary  x set, if not hid re/im button .
      dimension: 1,
    },
    ...info,
  };

  spectrum.originalInfo = spectrum.info;

  spectrum.data = {
    ...{
      x: [],
      re: [],
      im: [],
      y: [],
    },
    ...data,
  };

  spectrum.originalData = spectrum.data;

  spectrum.peaks = { ...{ values: [], options: {} }, ...peaks };

  spectrum.integrals = {
    ...{ values: [], options: { sum: 100 } },
    ...options.integrals,
  };

  spectrum.ranges = {
    ...{ values: [], options: { sum: 100 } },
    ...options.ranges,
  };

  (spectrum.data ).y = spectrum.data.re;
  return spectrum;
}
