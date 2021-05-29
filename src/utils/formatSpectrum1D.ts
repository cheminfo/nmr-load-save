// import { Spectrum1D } from 'cheminfo-types';
import { Spectrum1D } from '../../types/Spectrum1D';
import { getData } from '../utility';

export function formatSpectrum1D(options: any): Spectrum1D {
  const {
    shiftX = 0,
    meta,
    peaks = {},
    filters = [],
    info = {},
    source = {},
    dependentVariables = [],
  } = options;
  let spectrum: any = { shiftX, meta, filters };

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

  spectrum.originalInfo = spectrum.info;

  let data = getData(dependentVariables[0].components);

  if (data.im) info.isComplex = true;
  if (Array.isArray(info.nucleus)) info.nucleus = info.nucleus[0];

  spectrum.data = {
    ...{
      x: [],
      re: [],
      im: [],
      y: [],
    },
    ...data,
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

  spectrum.data.y = spectrum.data.re;

  return spectrum;
}
