import Jszip from 'jszip';
import { NmrRecord, parseSDF } from 'nmredata';

import { readJcamp } from '../../reader/readJcamp';
import { readBrukerZip } from '../../reader/readBrukerZip';
import { addRanges } from './tools/nmredata/addRanges';
import { addZones } from './tools/nmredata/addZones';

export async function nmredataToNmrium(file, options) {
  const jszip = new Jszip();
  const zip = await jszip.loadAsync(file.binary);
  const sdfFiles = await getSDF(zip.files);
  const jsonData = await NmrRecord.toJSON({
    sdf: sdfFiles[0],
    zipFiles: zip.files,
  });

  let { spectra, molecules = [] } = jsonData;

  let nmrium = {
    spectra: [],
    molecules,
  };

  for (const data of spectra) {
    const { file, jcampURL } = data.source;

    let spectrum = await getSpectra(file, { jcampURL });

    for (let i = 0; i < spectrum.length; i++) {
      const { info } = spectrum[i];

      if (info.isFid) continue;

      if (info.dimension > 1) {
        addZones(data.signals, spectrum[i]);
      } else {
        addRanges(data.signals, spectrum[i]);
      }
    }
    nmrium.spectra.push(...spectrum);
  }

  return nmrium;
}

async function getSpectra(file, options = {}) {
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
      return readBrukerZip(
        file.binary,
        { xy, noContours, keepOriginal },
      );
    default:
      if (!jcampURL) {
        new Error('file extension is not supported');
        return;
      }
  }
}

async function getSDF(zipFiles) {
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
