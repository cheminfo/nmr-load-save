import { mapRanges } from '../mapRanges';
import { Spectrum1D } from '../../../../types/Spectra/Spectrum1D';

interface ComputeFromTo {
  to: number;
  from: number;
}

interface ComputeFromToOptions {
  delta: number;
  j?: Array<any>;
  frequency?: number;
}

export function addRanges(signals: Array<any>, datum: Spectrum1D): void {
  let ranges = [];
  const { baseFrequency: frequency = 500 } = datum.info;
  for (const signal of signals) {
    const { jCoupling: j, delta, diaID = [], multiplicity, integral } = signal;
    const fromTo = computeFromTo({ delta, j, frequency });
    ranges.push({
      ...fromTo,
      integral,
      signal: [
        {
          j,
          delta,
          diaID,
          multiplicity,
        },
      ],
    });
  }
  datum.ranges.values = mapRanges(joinRanges(ranges), datum);
}

function computeFromTo(options: ComputeFromToOptions ): ComputeFromTo {
  const { delta, j: couplings = [], frequency = 400 } = options;
  let width = 0.5;
  for (let j of couplings) {
    width += j.coupling;
  }
  width /= frequency;
  return { from: delta - width, to: delta + width };
}

function joinRanges(ranges: Array<any>) {
  ranges.sort((a, b) => a.from - b.from);
  for (let i = 0; i < ranges.length - 1; i++) {
    if (ranges[i].to > ranges[i + 1].from) {
      ranges[i].to = Math.max(ranges[i + 1].to, ranges[i].to);
      ranges[i].signal = ranges[i].signal.concat(ranges[i + 1].signal);
      ranges[i].integral += ranges[i + 1].integral;
      ranges.splice(i + 1, 1);
      i--;
    }
  }
  return ranges;
}
