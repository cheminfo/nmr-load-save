import type { Spectrum1D, Spectrum2D } from 'cheminfo-types';

import { isSpectrum2D } from '../isSpectrum2D';

interface SignalAxis {
  delta: number;
  diaID?: string[];
  originDelta: number;
}

export function checkSpectrum(spectrum: Spectrum1D | Spectrum2D, diaIDs: any) {
  const currentDiaID = isSpectrum2D(spectrum)
    ? getAssignmentsFrom2D(spectrum)
    : getAssignmentsFrom1D(spectrum);

  return Object.keys(diaIDs).some((diaID) => currentDiaID.includes(diaID));
}

function getAssignmentsFrom1D(spectrum: Spectrum1D): string[] {
  const ranges = spectrum.ranges.values || [];
  let diaID = [];
  for (let range of ranges) {
    for (const signal of range.signal) {
      if (signal.diaID) {
        if (signal.diaID.length > 0) diaID.push(...signal.diaID);
      }
      if (!signal.j) continue;
      for (const jcoupling of signal.j) {
        if (jcoupling.diaID) {
          let { diaID } = jcoupling;
          if (!Array.isArray(diaID)) diaID = [diaID];
          diaID.push(...diaID);
        }
      }
    }
  }
  return diaID;
}

function getAssignmentsFrom2D(spectrum: Spectrum2D): string[] {
  const zones = spectrum.zones.values || [];
  let diaID = [];
  for (let zone of zones) {
    for (const signal of zone.signal) {
      for (let axis of ['x', 'y']) {
        const signalAxis = signal[axis] as SignalAxis;
        if (!signalAxis) continue;
        if (signalAxis.diaID && signalAxis.diaID.length > 0) {
          diaID.push(...signalAxis.diaID);
        }
      }
    }
  }
  return diaID;
}
