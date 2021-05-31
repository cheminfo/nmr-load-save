import Jszip from 'jszip';
import { NmrRecord, parseSDF } from 'nmredata';

import { readJcamp } from '../../reader/readJcamp';
import { readBrukerZip } from '../../reader/readBrukerZip';
import { addRanges } from '../tools/nmredata/addRanges';
import { addZones } from '../tools/nmredata/addZones';
import type { JSZipObject } from 'jszip';
import { Options } from '../../../types/Options';
import { LoadedFiles } from '../../../types/LoadedFiles';
import { Spectrum1D } from '../../../types/Spectra/Spectrum1D'
import { Spectrum2D } from '../../../types/Spectra/Spectrum2D'
import { Output } from '../../../types/Output';

type ZipFiles = { [key: string]: JSZipObject };

export async function nmredataToNmrium(files: ZipFiles, options: Options) {
  const sdfFiles = await getSDF(files);
  const jsonData = await NmrRecord.toJSON({
    sdf: sdfFiles[0],
    zipFiles: files,
  });

  let { spectra, molecules = [] } = jsonData;

  let nmrium: Output = {
    spectra: [],
    molecules,
  };

  for (const data of spectra) {
    const { file, jcampURL } = data.source;

    let { spectra } = await getSpectra(file, { jcampURL });

    for (let i = 0; i < spectra.length; i++) {
      const { info } = spectra[i];

      if (info.isFid) continue;

      let spectrum = spectra[i];
      if (isSpectrum2D(spectrum)) {
        addZones(data.signals, spectrum, options);
      } else {
        addRanges(data.signals, spectrum);
      }
    }
    nmrium.spectra.push(...spectra);
  }

  return nmrium;
}

function isSpectrum2D(spectrum: Spectrum1D | Spectrum2D ): spectrum is Spectrum2D {
  return (spectrum as Spectrum2D).zones !== undefined;
}

export async function nmredataZipToNmrium(file: LoadedFiles, options: Options) {
  const { base64 } = options;
  const jszip = new Jszip();
  const zip = await jszip.loadAsync(file.binary, { base64 });
  return nmredataToNmrium(zip.files, options);
}

async function getSpectra(file: LoadedFiles, options: Partial<Options> = {}) {
  const {
    xy = true,
    noContours = true,
    keepOriginal = true,
    jcampURL,
  } = options;
  switch (file.extension) {
    case 'jdx':
    case 'dx':
      return readJcamp(file.binary, { xy, noContours });
    case 'zip':
      return readBrukerZip(file.binary, { xy, noContours, keepOriginal });
    default:
      return { spectra: [], molecules: [] };
  }
}

async function getSDF(zipFiles: ZipFiles) {
  let result = [];
  for (const file in zipFiles) {
    const pathFile = file.split('/');
    if (pathFile[pathFile.length - 1].match(/^[^.].+sdf$/)) {
      const filename = pathFile[pathFile.length - 1].replace(/\.sdf/, '');
      const root = pathFile.slice(0, pathFile.length - 1).join('/');
      const sdf = await zipFiles[file].async('string');
      let parserResult = parseSDF(`${sdf}`, { mixedEOL: true });
      parserResult.filename = filename;
      parserResult.root = root !== '' ? `${root}/` : '';
      result.push(parserResult);
    }
  }
  return result;
}
