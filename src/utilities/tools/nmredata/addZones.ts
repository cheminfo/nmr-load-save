import generateID from '../../generateID';
import { Spectrum2D } from '../../../../types/Spectra/Spectrum2D';
import { Options } from '../../../../types/Options';
import { Zone } from '../../../../types/Zones/Zone';
import { Signal2D } from '../../../../types/Signals/Signal2D';

interface xyObject {
  [axis: string]: number;
  y: number;
  x: number;
}

const axisLabels: Array<string> = ['x', 'y'];
const defaultShift: xyObject = { x: 0, y: 0 };

export function addZones(
  signals: Array<any>,
  datum: Spectrum2D,
  options: Options,
) {
  let zones: any[] = [];
  const { shift = defaultShift } = options;
  const { baseFrequency = [400, 400] } = datum.info;
  const frequency: xyObject = { x: baseFrequency[0], y: baseFrequency[1] };

  for (const signal of signals) {
    let zone: Partial<Zone> = {
      x: {},
      y: {},
      id: generateID(),
      kind: 'signal',
    };
    let signalFormated: Partial<Signal2D> = {
      id: generateID(),
      kind: 'signal',
      peak: [],
    };
    let width: xyObject = { x: 10, y: 10 };
    for (let axis of axisLabels) {
      let { coupling = [], delta, diaID = [] } = signal[axis];
      for (let j of coupling) {
        width[axis] += j.coupling;
      }
      if (signal.activeCoupling) {
        const { activeCoupling = [] } = signal;
        for (let j of activeCoupling) {
          width[axis] += j.coupling;
        }
      }
      width[axis] /= frequency[axis];

      zone[axis] = {
        from: delta - width[axis],
        to: delta + width[axis],
      };

      signalFormated[axis] = {
        delta,
        diaID,
        originDelta: delta - shift[`${axis}Shift`],
      };
    }
    zones.push({
      ...zone,
      signal: [signalFormated],
    });
  }
  datum.zones.values = zones;
}
