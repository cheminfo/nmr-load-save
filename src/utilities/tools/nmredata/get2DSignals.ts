import type JSZipType from 'jszip';

import { Spectra } from '../../../../types/Spectra/Spectra';
import { ByDiaID } from '../../../../types/utilities/writeNmreData/ByDiaID';
import { Options } from '../../../../types/utilities/writeNmreData/Options';
import { isSpectrum2D } from '../isSpectrum2D';

import { addSource } from './addSource';
import { getCouplingObserved } from './getCouplingObserved';
import { getToFix } from './getToFix';

import { checkSpectrum } from './checkSpectrum';

const isArray = Array.isArray;

export async function get2DSignals(data: Spectra, nmrRecord: JSZipType, options: Options) {
  const { byDiaID } = options.labels;
  let str = '';
  let nucleusRecorded = [];
  const prefix = `\n> <NMREDATA_2D_`;
  for (let spectrum of data) {
    if (!isSpectrum2D(spectrum)) continue;

    if (!checkSpectrum(spectrum, byDiaID)) continue;

    let partTag = '';
    const { info, source } = spectrum;
    let { nucleus, experiment, pulseSequence } = info;

    nucleusRecorded.push(nucleus);

    let couplingObserved = getCouplingObserved(experiment);
    if (nucleus) {
      partTag += `${prefix}${nucleus[1]}_${couplingObserved}_${nucleus[0]}>`;
    }
    let toFix = getToFix(nucleus);

    partTag += await addSource(nmrRecord, {
      spectrum,
      source,
    });

    if (experiment) partTag += `\nCorType=${experiment} \\`;
    if (pulseSequence) partTag += `\nPulseProgram=${pulseSequence} \\`;

    if (spectrum.info.baseFrequency) {
      partTag += `\nLarmor=${Number(spectrum.info.baseFrequency[0]).toFixed(
        2,
      )}\\`;
    }

    let zones = spectrum.zones.values || [];
    for (let zone of zones) {
      let signals = zone.signal;
      for (let signal of signals) {
        let { x, y, peak } = signal;
        let xLabel = getAssignment(x, byDiaID, toFix[0]);
        let yLabel = getAssignment(y, byDiaID, toFix[1]);
        let intensity = isArray(peak) ? Math.max(...peak.map((e) => e.z)) : 0;
        partTag += `\n${xLabel}/${yLabel}, I=${intensity.toFixed(2)}\\`;
      }
    }
    str += partTag;
  }
  return str.length > 0 ? `${str}\n` : '';
}

function getAssignment(axis: any, labels: ByDiaID, toFix: number) {
  let { diaID, delta } = axis;
  if (diaID) {
    if (!isArray(diaID)) diaID = [diaID];
    if (diaID.length < 1) return Number(delta).toFixed(toFix);
    let label:string = diaID.map((diaID: string) => {
      let label: string = labels[diaID].label;
      return label;
    }).join(',');
    return diaID.length > 1 ? `(${label})` : label;
  }
  return Number(delta).toFixed(toFix);
}
