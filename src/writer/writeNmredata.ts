import JSZip from 'jszip';
import { getGroupedDiastereotopicAtomIDs } from 'openchemlib-utils';
import { Molecule as OCLMolecule } from 'openchemlib/full';

import { Output as State } from '../../types/Output';
import { Spectra } from '../../types/Spectra/Spectra';
import { ByDiaID } from '../../types/utilities/writeNmreData/ByDiaID';
import generateID from '../utilities/generateID';
import { get1DSignals } from '../utilities/tools/nmredata/get1DSignals';
import { get2DSignals } from '../utilities/tools/nmredata/get2DSignals';
import { getLabels } from '../utilities/tools/nmredata/getLabels';

type JSZipType = typeof JSZip;

interface addNMReDataOptions {
  id?: string;
  prefix?: string;
  filename?: string;
  molecule: {
    [index: string]: string;
    molfile: string;
  };
}

interface Tags {
  [index: string]: string;
}

const tags: Tags = {
  solvent: 'SOLVENT',
  temperature: 'TEMPERATURE',
  assignment: 'ASSIGNMENT',
  j: 'J',
  signals: 'SIGNALS',
  id: 'ID',
};

export async function writeNmredata(state: State, options: any = {}): Promise<JSZipType> {
  const { spectra: data, molecules } = state || {
    spectra: [],
    molecules: [],
  };
  let nmrRecord = new JSZip();

  for (const molecule of molecules) {
    await addNMReDATA(data, nmrRecord, {
      ...options,
      molecule,
    });
  }

  return nmrRecord;
}

async function addNMReDATA(
  data: Spectra,
  nmrRecord: JSZipType,
  options: addNMReDataOptions,
) {
  let {
    id,
    prefix = '\n> <NMREDATA_',
    filename = `nmredata ${generateID()}`,
    molecule,
  } = options;

  let sdfResult = '';

  const oclMolecule = OCLMolecule.fromMolfile(molecule.molfile);
  sdfResult += oclMolecule.toMolfile();
  oclMolecule.addImplicitHydrogens();
  const groupedDiaIDs = getGroupedDiastereotopicAtomIDs(oclMolecule);
  let labels = getLabels(data, { groupedDiaIDs, molecule: oclMolecule });

  sdfResult += `${prefix}VERSION>\n1.1\\\n`;
  sdfResult += putTag(data, 'temperature', { prefix });
  sdfResult += putTag(data, 'solvent', { prefix });

  if (id) sdfResult += `${prefix + tags.id}>\nid\\\n`;
  sdfResult += formatAssignments(labels.byDiaID, { prefix });
  sdfResult += await get1DSignals(data, nmrRecord, { prefix, labels });
  sdfResult += await get2DSignals(data, nmrRecord, { prefix, labels });
  sdfResult += '\n$$$$\n';
  nmrRecord.file(`${filename}.sdf`, sdfResult);
}

function formatAssignments(labels: ByDiaID, options: { prefix?: string } = {}) {
  if (!labels) return '';
  const { prefix = '' } = options;
  let str = `${prefix + tags.assignment}>\n`;
  for (let l in labels) {
    let atoms = labels[l].atoms;
    str += `${labels[l].label}, ${labels[l].shift}`; // change to add label
    for (let atom of atoms) str += `, ${atom}`;
    str += '\\\n';
  }
  return str;
}

function putTag(
  spectra: Spectra,
  tag: string,
  options: { prefix?: string } = {},
) {
  const { prefix } = options;
  let str = '';
  for (let spectrum of spectra) {
    if (spectrum.info[tag]) {
      str += `${prefix + tags[tag]}>\n${String(spectrum.info[tag])}\\\n`;
      break;
    }
  }
  return str;
}
