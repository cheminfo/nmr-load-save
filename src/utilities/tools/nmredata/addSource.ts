import fetch from 'cross-fetch';
import Jszip from 'jszip';

import { LoadedFiles } from '../../../../types/LoadedFiles';
import { Spectrum1D } from '../../../../types/Spectra/Spectrum1D';
import { Spectrum2D } from '../../../../types/Spectra/Spectrum2D';

type JSZipType = typeof Jszip;

interface Source {
  jcampURL?: string;
  file?: LoadedFiles;
}

interface OptionsAddSource {
  spectrum: Spectrum1D | Spectrum2D;
  source: Source;
}

const jszip = new Jszip();
export async function addSource(
  nmrRecord: JSZipType,
  options: OptionsAddSource,
) {
  const { spectrum, source } = options;
  const { file, jcampURL } = source;
  let tag = '';
  const dimension = `${spectrum.info.dimension}d`;

  if (jcampURL) {
    void (await fetch(jcampURL).then(async (jcamp) => {
      if (!jcamp) return;
      let name = jcampURL.split('/').slice(-1);
      const path = `jcamp/${dimension}/${name[0]}`;
      tag += `\nJcamp_Location=file:${path}\\`;
      nmrRecord.file(path, await jcamp.arrayBuffer());
    }));
  } else if (file) {
    switch (file.extension) {
      case 'jdx':
      case 'dx':
        tag += `\nJcamp_Location=file:jcamp/${dimension}/${spectrum.display.name}\\`;
        nmrRecord.file(
          `jcamp/${dimension}/${spectrum.display.name}`,
          file.binary,
        );
        break;
      case 'zip':
        if (!file.binary) return;
        void jszip.loadAsync(file.binary).then(async (zip) => {
          for (const file in zip.files) {
            if (file.endsWith('/')) continue;
            const zipFile = zip.file(file);
            if (zipFile !== null) {
              nmrRecord.file(
                `Bruker/${file}`,
                await zipFile.async('arraybuffer'),
              );
            }

          }
          tag += `\nSpectrum_Location=file:Bruker/${getPathFromZip(zip)}\\`;
        });
        break;
      default:
        new Error(`This extension is not supported`);
    }
  }

  return tag;
}

function getPathFromZip(zip: JSZipType) {
  let files = zip.filter(function (relativePath) {
    if (/__MACOSX/.exec(relativePath)) return false;
    if (
      relativePath.endsWith('fid') ||
      relativePath.endsWith('1r') ||
      relativePath.endsWith('ser') ||
      relativePath.endsWith('2rr')
    ) {
      return true;
    }
    return false;
  });
  const index = files.findIndex(
    (file) => file.name.endsWith('1r') || file.name.endsWith('2rr'),
  );
  return index > -1 ? files[index].name : files[0].name;
}
