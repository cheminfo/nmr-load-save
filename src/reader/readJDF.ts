import { Data1D } from 'cheminfo-types';
import { fromJEOL } from 'nmr-parser';
import { Options } from '../types/Options';

export function readJDF(jdf: Uint8Array, options: Options) {
  const { name = '' } = options;
  let converted = fromJEOL(jdf, {});
  let info = converted.description;
  let metadata = info.metadata;
  // delete info.metadata;
  const acquisitionMode = 0;
  const experiment = info.dimension === 1 ? '1d' : '2d';
  const type = 'NMR SPECTRUM';
  const nucleus = info.nucleus[0];
  const numberOfPoints = info.numberOfPoints[0];
  const acquisitionTime = info.acquisitionTime[0];

  const baseFrequency = info.baseFrequency[0];
  const frequencyOffset = info.frequencyOffset[0];

  const spectralWidthClipped = converted.application.spectralWidthClipped;

  let spectra = [];
  if (info.dimension === 1) {
    if (converted.dependentVariables) {
      spectra.push(formatCSD(converted));
    }
  }

  return {
    data: spectra,
    info: {
      ...info,
      acquisitionMode,
      experiment,
      type,
      nucleus,
      numberOfPoints,
      acquisitionTime,
      baseFrequency,
      frequencyOffset,
      spectralWidthClipped,
    },
    meta: metadata,
    source: {
      name,
      extension: 'jdf',
      binary: jdf,
    },
    ...options,
  };
}

function formatCSD(result: any): Data1D {
  let dimension = result.dimensions[0];
  let dependentVariables = result.dependentVariables;

  let quantityName = dimension.quantityName;
  let n = dimension.count;
  let incr = dimension.increment.magnitude;
  let origin = dimension.originOffset.magnitude;
  let offset = dimension.coordinatesOffset.magnitude;

  let buffer = dependentVariables[0].components[0];
  let re = [];
  let im = [];
  for (let i = buffer.length - 1; i > 0; i -= 2) {
    re.push(buffer[i - 1]);
    im.push(buffer[i]);
  }

  let data: Data1D = {};
  let i, x0;
  switch (quantityName) {
    case 'frequency':
      x0 = 0 + (offset / origin) * 1000000;
      i = (incr / origin) * 1000000;
      data.re = re;
      data.im = im;
      break;
    case 'time':
      x0 = origin;
      i = incr;
      data.re = re.reverse();
      data.im = im.reverse().map((z) => -z);
      break;
    default:
      break;
  }

  let scale = [];
  for (let x = 0; x < n; x++) {
    scale.push(x0 + x * i);
  }

  data.x = scale;
  return data;
}
