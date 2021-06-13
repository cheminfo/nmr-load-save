import fetch from 'cross-fetch';
import { fromJCAMP } from 'nmr-parser';

import { JcampParsingOptions } from '../../types/Options/JcampParsingOptions';
import { Output } from '../../types/Output';
import generateID from '../utilities/generateID';
import { formatSpectra } from '../utilities/formatSpectra';

type Text = string | ArrayBuffer;
export function readJcamp(text: Text, options: JcampParsingOptions = {}): Output {
  let output: any = { spectra: [], molecules: [] };

  let entries = fromJCAMP(
    text,
    {
      ...{
        noContour: true,
        xy: true,
        keepRecordsRegExp: /.*/,
        profiling: true,
      },
      ...options,
    },
  );
  
  const { name = `jcamp${generateID()}`} = options;
  const { source = { file: { name, extension: 'jdx', binary: text} } } = options;
  for (let entry of entries) {
    const { dependentVariables, info, meta } = entry;
    output.spectra.push({ dependentVariables, meta, info, source });
  }

  return formatSpectra(output);
}

export function readJcampFromURL(jcampURL: string, options: JcampParsingOptions = {}): Promise<Output> {
  return fetch(jcampURL)
    .then((response) => response.arrayBuffer())
    .then((jcamp) => readJcamp(jcamp, {
      ...{ source: { jcampURL } },
      ...options
    }));
}