import { Spectrum1D, Spectrum2D } from 'cheminfo-types';
import JSZip from 'jszip';

import { getFileExtension, loadFilesFromZip } from './fileUtility';
import { formatSpectrum1D } from './formatSpectrum1D';
import { formatSpectrum2D } from './formatSpectrum2D';
import { readBrukerZip } from './reader/readBrukerZip';
import { readJDF } from './reader/readJDF';
import { readText } from './reader/readText';
import { LoadFilesFromZip } from './types/LoadFilesFromZip';
import { ReadZipOptions } from './types/ReadZipOptions';
import { readZipOutput } from './types/readZipOutput';
import { FILES_TYPES } from './utility';

type InputZip = Uint8Array | string;
type Spectrum = Array<Spectrum1D | Spectrum2D>;

const MONO_DIMENSIONAL = 1;
const BI_DIMENSIONAL = 2;

export async function readZip(
  zipFile: InputZip,
  options: Partial<ReadZipOptions> = {},
  result: readZipOutput = { spectra: [], molecules: [] },
): Promise<readZipOutput> {
  const { base64 } = options;
  const jszip = new JSZip();
  let zip = await jszip.loadAsync(zipFile, { base64 });

  let uniqueFileExtensions: Array<string> = [];
  for (let name in zip.files) {
    let extension: string = getFileExtension(name);
    if (!uniqueFileExtensions.includes(extension))
      {uniqueFileExtensions.push(extension);}
  }

  let hasBruker = Object.keys(zip.files).some((name) =>
    ['2rr', 'fid', '1r'].some((brukerFile) => name.endsWith(brukerFile)),
  );

  if (hasBruker) {
    let spectrum: Spectrum = await readBrukerZip(zipFile, options);
    if (spectrum) result.spectra.push(...spectrum);
  }

  let hasOthers = uniqueFileExtensions.some((ex) => FILES_TYPES[ex]);

  if (!hasOthers) return formatSpectrum(result);

  for (let extension of uniqueFileExtensions) {
    const selectedFilesByExtensions = zip.filter(
      (file) => getFileExtension(file.name) === extension,
    );
    let files: LoadFilesFromZip[];
    switch (extension) {
      case FILES_TYPES.MOL:
        files = await loadFilesFromZip(selectedFilesByExtensions);
        result.molecules.push(...files.map((file) => readText(file.binary)));
        break;
      case FILES_TYPES.JDX:
      case FILES_TYPES.DX:
        files = await loadFilesFromZip(selectedFilesByExtensions, {
          asBuffer: true,
        });
        result.spectra.push(
          ...files.map((file) => readText(file.binary, options)),
        );
        break;
      case FILES_TYPES.JDF:
        files = await loadFilesFromZip(selectedFilesByExtensions, {
          asBuffer: true,
        });
        for (let file of files) {
          let { name, binary } = file;
          if (typeof binary !== 'string') {
            result.spectra.push(readJDF(binary, { name, ...options }))
          }
        }
        break;
      case FILES_TYPES.ZIP:
        files = await loadFilesFromZip(selectedFilesByExtensions, {
          asBuffer: true,
        });
        for (let file of files) {
          result = await readZip(file.binary, options, result);
        }
      default:
        break;
    }
  }
  return formatSpectrum(result);
}

function formatSpectrum(input: readZipOutput): any {
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
