import { xyIntegration } from 'ml-spectra-processing';

import { Options } from '../../../types/Options';
import { Signal1D } from '../../../types/Signals/Signal1D';
import { Spectrum1D } from '../../../types/Spectra/Spectrum1D';
import { signalKinds } from '../../constants/signalKinds';
import generateID from '../generateID';

interface InputRange {
  from: number;
  to: number;
  signal: Array<Signal1D>;
}

export function mapRanges(
  ranges: Array<InputRange>,
  datum: Spectrum1D,
  options: Options = {},
) {
  const { x, re } = datum.data;
  const { shiftX = 0 } = options;

  const error = (x[x.length - 1] - x[0]) / 10000;

  return ranges.reduce((acc: Array<any>, newRange) => {
    // check if the range is already exists
    for (const { from, to } of datum.ranges.values) {
      if (
        Math.abs(newRange.from - from) < error &&
        Math.abs(newRange.to - to) < error
      ) {
        return acc;
      }
    }

    const absolute = xyIntegration(
      { x, y: re },
      { from: newRange.from, to: newRange.to, reverse: true },
    );
    const signal = newRange.signal.map((_signal) => {
      return Object.assign(
        {
          kind: 'signal',
          id: generateID(),
          originDelta: _signal.delta - shiftX,
        },
        _signal,
      );
    });
    acc.push({
      kind: newRange.signal[0].kind || signalKinds.signal,
      originFrom: newRange.from - shiftX,
      originTo: newRange.to - shiftX,
      ...newRange,
      id: generateID(),
      absolute,
      signal,
    });

    return acc;
  }, []);
}
