import { readFileSync } from 'fs';
import { writeNmredata } from '../writeNmredata';
import { read } from '../../reader/read';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { Spectrum1D } from '../../../types/Spectra/Spectrum1D';

describe('writeNmredata', () => {
  it('use nmrium file', async () => {
    const path = './src/writer/__tests__/ethylbenzene.nmrium';
    const binary = readFileSync(path);
    const data = await read([{ name: path, binary }]);
    let spectra = data.spectra[0] as Spectrum1D;
    const nmredata = await writeNmredata(data);
    const keys = Object.keys(nmredata.files);
    expect(keys.includes('nmredata.sdf')).toBe(true);
  });
});
