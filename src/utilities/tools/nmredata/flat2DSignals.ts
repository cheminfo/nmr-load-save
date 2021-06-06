import { Signal2D } from '../../../../types/Signals/Signal2D';

export function flat2DSignals(signals: Signal2D[] = []) {
  let flattedSignal = [];
  for (let { x, y } of signals) {
    flattedSignal.push(x, y);
  }
  return flattedSignal;
}
