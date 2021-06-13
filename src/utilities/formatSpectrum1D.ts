// import { Spectrum1D } from 'cheminfo-types';
import { Spectrum1D } from '../../types/Spectra/Spectrum1D';

import generateID from './generateID';
import { getData } from './utility';

export function formatSpectrum1D(spectrumData: any): Spectrum1D {
  const {
    id = generateID(),
    shiftX = 0,
    meta,
    peaks = {},
    filters = [],
    info = {},
    source = {},
    dependentVariables = [],
  } = spectrumData;
  let spectrum: any = { id, shiftX, meta, filters };

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

  let { data = getData(dependentVariables[0].components) } = spectrumData;

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

  spectrum.display = Object.assign(
    {
      name: spectrumData.display?.name ? spectrumData.display.name : id,
      color: 'black',
      isVisible: true,
      isPeaksMarkersVisible: true,
      isRealSpectrumVisible: true,
      isVisibleInDomain: true,
    },
    spectrumData.display,
  )

  spectrum.originalData = spectrum.data;

  spectrum.peaks = { ...{ values: [], options: {} }, ...peaks };

  spectrum.integrals = {
    ...{ values: [], options: { sum: 100 } },
    ...spectrumData.integrals,
  };

  spectrum.ranges = {
    ...{ values: [], options: { sum: 100 } },
    ...spectrumData.ranges,
  };

  spectrum.data.y = spectrum.data.re;

  return spectrum;
}
