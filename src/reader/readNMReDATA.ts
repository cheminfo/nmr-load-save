import Jszip from 'jszip';
import type { JSZipObject } from 'jszip';
import { NmrRecord, parseSDF } from 'nmredata';

import { LoadedFiles } from '../../types/LoadedFiles';
import { NmredataParsingOptions } from '../../types/Options/NmredataParsingOptions';
import { Output } from '../../types/Output';
import { Source } from '../../types/Source';
import { isSpectrum2D } from '../utilities/tools/isSpectrum2D';
import { addRanges } from '../utilities/tools/nmredata/addRanges';
import { addZones } from '../utilities/tools/nmredata/addZones';

import { readBrukerZip } from './readBrukerZip';
import { readJcamp, readJcampFromURL } from './readJcamp';

interface ZipFiles {
  [key: string]: JSZipObject;
}

export async function readNMReDataFiles(
  files: ZipFiles,
  options: NmredataParsingOptions,
) {
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
    let { spectra } = await getSpectra(data.source, options);
    for (const spectrum of spectra) {
      const { info } = spectrum;

      if (info.isFid) continue;

      if (isSpectrum2D(spectrum)) {
        addZones(data.signals, spectrum);
      } else {
        addRanges(data.signals, spectrum);
      }
    }
    nmrium.spectra.push(...spectra);
  }

  return nmrium;
}

export async function readNMReData(
  file: LoadedFiles,
  options: NmredataParsingOptions = {},
) {
  const { base64 } = options;
  const jszip = new Jszip();
  const zip = await jszip.loadAsync(file.binary, { base64 });
  return readNMReDataFiles(zip.files, options);
}

async function getSpectra(
  source: Source,
  options: NmredataParsingOptions = {},
) {
  const { file, jcampURL } = source;
  const { brukerParsingOptions, jcampParsingOptions } = options;

  if (jcampURL) {
    return readJcampFromURL(jcampURL, {
      ...{ xy: true, noContours: true },
      ...jcampParsingOptions,
    });
  }

  if (!file) return { spectra: [], molecules: [] };

  switch (file.extension) {
    case 'jdx':
    case 'dx':
    case 'jcamp':
      return readJcamp(file.binary, {
        ...{ xy: true, noContours: true },
        ...jcampParsingOptions,
      });
    case 'zip':
      return readBrukerZip(file.binary, {
        ...{ xy: true, noContours: true, keepOriginal: true },
        ...brukerParsingOptions,
      });
    default:
      throw new Error('There is not a supported source');
  }
}

async function getSDF(zipFiles: ZipFiles) {
  let result = [];
  for (const file in zipFiles) {
    const pathFile = file.split('/');
    if (/^[^.].+sdf$/.exec(pathFile[pathFile.length - 1])) {
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
