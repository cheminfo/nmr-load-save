interface DiaID {
  [index: string]: number | string | number[];
  counter: number;
  atoms: number[];
  oclID: string;
  atomLabel: string;
}

type GroupedDiastereotopicAtomIDs = DiaID[];

interface getShortestPathsOptions {
  toLabel: string;
  maxLength: number;
}

declare module 'openchemlib-utils' {
  import type { Molecule as OCLMolecule } from 'openchemlib/full';

  function getShortestPaths(
    molecule: OCLMolecule,
    options: getShortestPathsOptions,
  ): number[][][];

  function getGroupedDiastereotopicAtomIDs(
    molecule: OCLMolecule,
  ): GroupedDiastereotopicAtomIDs;
}
