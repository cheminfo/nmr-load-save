import { Signal2D } from '../../../../types/Signals/Signal2D';

export function flat2DSignals(signals: Signal2D[] = []) {
  let flattedSignal = [];
  for (let i = 0; i < signals.length; i++) {
    let { x, y } = signals[i];
    flattedSignal.push(x, y);
  }
  return flattedSignal;
}
