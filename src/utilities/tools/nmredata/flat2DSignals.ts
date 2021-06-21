import type { Signal2D } from 'cheminfo-types';

interface SignalAxis {
  delta: number;
  diaID?: string[];
  originDelta: number;
}

export function flat2DSignals(signals: Signal2D[] = []) {
  let flattedSignal = [] as SignalAxis[];
  for (let { x, y } of signals) {
    flattedSignal.push(x, y);
  }
  return flattedSignal;
}
