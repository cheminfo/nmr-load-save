import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import JSZip from 'jszip';

import { getFileExtension, loadFilesFromZip } from '../fileUtility';
import { formatSpectrum1D } from '../formatSpectrum1D';
import { formatSpectrum2D } from '../formatSpectrum2D';
import { LoadFilesFromZip } from '../types/LoadFilesFromZip';
import { Output } from '../types/Output';
import { ReadZipOptions } from '../types/ReadZipOptions';
import { FILES_TYPES } from '../utility';

import { readBrukerZip } from './readBrukerZip';
import { readByExtension } from './readByExtension';
import { readText } from './readText';

type InputZip = Uint8Array | string;
type Spectrum = Array<Spectrum1D | Spectrum2D>;

const MONO_DIMENSIONAL = 1;
const BI_DIMENSIONAL = 2;

export async function readZip(
  zipFile: InputZip,
  options: Partial<ReadZipOptions> = {},
): Promise<Output> {
  const { base64 } = options;
  const jszip = new JSZip();
  let zip = await jszip.loadAsync(zipFile, { base64 });

  let result: Output = { spectra: [], molecules: [] };

  let uniqueFileExtensions: Array<string> = [];
  for (let name in zip.files) {
    let extension: string = getFileExtension(name);
    if (!uniqueFileExtensions.includes(extension)) {
      uniqueFileExtensions.push(extension);
    }
  }

  let hasBruker = Object.keys(zip.files).some((name) =>
    ['2rr', 'fid', '1r'].some((brukerFile) => name.endsWith(brukerFile)),
  );

  if (hasBruker) {
    let spectrum: Spectrum = await readBrukerZip(zipFile, options);
    if (spectrum) result.spectra.push(...spectrum);
  }

  let hasOthers = uniqueFileExtensions.some((ex) => FILES_TYPES[ex]);

  if (hasOthers) {
    for (let extension of uniqueFileExtensions) {
      const selectedFilesByExtensions = zip.filter(
        (file) => getFileExtension(file.name) === extension,
      );
      let files: LoadFilesFromZip[] = await loadFilesFromZip(
        selectedFilesByExtensions,
        {
          asBuffer: extension === FILES_TYPES.MOL ? false : true,
        },
      );
      let partialResult: Output = await readByExtension(files, options);
      result.spectra.push(...partialResult.spectra);
      result.molecules.push(...partialResult.molecules);
    }
  }
  return formatSpectrum(result);
}

function formatSpectrum(input: Output): any {
  const { spectra: inputSpectra = [], molecules } = input;
  let spectra = [];
  for (let spectrum of inputSpectra) {
    const { info } = spectrum;
    switch (info.dimension) {
      case 'MONO_DIMENSIONAL':
        spectra.push(formatSpectrum1D(spectrum));
        break;
      case 'BI_DIMENSIONAL':
        spectra.push(formatSpectrum2D(spectrum));
        break;
    }
  }
  return { molecules, spectra };
}
