import { bruker } from 'bruker-data-test';
import { jcamp } from 'jcamp-data-test';
import { nmredata } from 'nmredata-data-test';

import { isSpectrum2D } from '../../utilities/tools/isSpectrum2D';
import { read } from '../read';

describe('read by extension', () => {
  it('jcamp', async () => {
    let jcampData = jcamp['aspirin-1h.dx'];
    let result = await read([
      {
        name: 'aspirin-1h.dx',
        extension: 'dx',
        binary: jcampData,
      },
    ]);
    const spectrum = result.spectra[0];
    if (!isSpectrum2D(spectrum)) {
      expect(spectrum.info.isFid).toBe(false);
      expect(spectrum.data.x).toHaveLength(32 * 1024);
    }
  });
  it('Bruker', async () => {
    let brukerData = bruker['aspirin-1h.zip'];
    let result = await read(
      [
        {
          name: 'aspirin-1h.zip',
          extension: 'zip',
          binary: brukerData,
        },
      ],
      { base64: true },
    );
    const spectrum = result.spectra[0];
    if (!isSpectrum2D(spectrum)) {
      expect(spectrum.info.isFid).toBe(true);
      expect(spectrum.data.x).toHaveLength(16384);
    }
  });
});
