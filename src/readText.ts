import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import { fromJcamp } from 'nmr-parser';
import { Molecule as OCLMolecule } from 'openchemlib/full';

export type ReadTextOutput = Array<Spectrum1D | Spectrum2D> | object;
export type Text = ArrayBuffer | string;

export function readText(text: Text, options: object = {}): ReadTextOutput {
  const inputString = typeof text === 'object' ? text.toString() : text.slice();
  if (inputString.includes('##title')) {
    return fromJcamp(inputString, options);
  } else if (inputString.includes('v2000') || inputString.includes('v3000')) {
    return OCLMolecule.fromMolfile(inputString);
  } else {
    throw new Error('The input should be ArrayBuffer or String of a jcamp file or molfile');
  }
}
