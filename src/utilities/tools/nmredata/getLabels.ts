import { getShortestPaths } from 'openchemlib-utils';

import { Spectra } from '../../../../types/Spectra/Spectra';
import { CreateLabelInput } from '../../../../types/utilities/writeNmreData/CreateLabelInput';
import { GetLabelsOptions } from '../../../../types/utilities/writeNmreData/GetLabelsOptions';
import { GetLabelsOutput } from '../../../../types/utilities/writeNmreData/GetLabelsOutput';

import { flat2DSignals } from './flat2DSignals';
import { getToFix } from './getToFix';


export function getLabels(
  data: Spectra,
  options: GetLabelsOptions,
): GetLabelsOutput {
  const { groupedDiaIDs, molecule } = options;

  let connections = getShortestPaths(molecule, { toLabel: 'H', maxLength: 1 });

  let byDiaID: any = {};
  let byAssignNumber: any = {};
  for (let spectrum of data) {
    let { dimension, nucleus } = spectrum.info;
    let toFix = getToFix(nucleus);

    let [roiKey, flatSignals] =
      dimension > 1
        ? ['zones', flat2DSignals]
        : ['ranges', (s: Array<any> | undefined) => s || []];

    let rois = spectrum[roiKey].values || [];
    for (let roi of rois) {
      let signals = flatSignals(roi.signal);
      for (let i = 0; i < signals.length; i++) {
        let diaIDs = signals[i].diaID || [];
        for (let diaID of diaIDs) {
          let delta = Number(signals[i].delta).toFixed(toFix[i % dimension]);
          // get atomLabel
          let groupedOclID = groupedDiaIDs.find((dia) => {
            if (dia.oclID === diaID) return true;
            return false;
          });
          // the addition of one in atom number it is because the atoms enumeration starts from zero
          if (!groupedOclID) continue;

          let labelOptions: CreateLabelInput = {
            atom: Number(groupedOclID.atoms[0]),
            molecule,
            connections,
            atomLabel: groupedOclID.atomLabel,
          };

          byDiaID[diaID] = {
            atoms: groupedOclID.atoms.map((e) => e + 1),
            shift: delta,
            label: createLabel(labelOptions),
          };

          for (let atom of groupedOclID.atoms) {
            labelOptions.atom = Number(atom);
            byAssignNumber[atom] = {
              shift: delta,
              diaID,
              label: createLabel(labelOptions),
            };
          }
        }
      }
    }
  }
  return { byAssignNumber, byDiaID };
}

function createLabel(options: CreateLabelInput): string {
  const { atom, molecule, atomLabel, connections } = options;
  let label = '';
  if (atomLabel !== 'C') {
    let connectedTo = connections[atom];
    let path = connectedTo.find((e: number[]) => e && e.length > 1);
    if (path) {
      let pLabel = `${atomLabel}${path[0] + 1}`;
      let hLabel = `${molecule.getAtomLabel(path[1])}${path[1] + 1}`;
      label = `${pLabel}${hLabel}`;
    }
  } else {
    label = `${atomLabel}${atom + 1}`;
  }
  return label;
}
