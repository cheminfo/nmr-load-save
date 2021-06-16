import { readFileSync } from 'fs';

import { read } from '../../reader/read';
import { writeNmredata } from '../writeNmredata';

describe('writeNmredata', () => {
  it('read nmrium and write nmredata', async () => {
    const path = './src/writer/__tests__/2-molecules-2-spectra.nmrium';
    const binary = readFileSync(path);
    const data = await read([{ name: path, binary }]);
    const nmredata = await writeNmredata(data);
    const keys = Object.keys(nmredata.files);
    expect(keys).toContain('nmredata.sdf');
    expect(keys).toContain('jcamp/1d/ethylbenzene-1H.jdx?dl=0');
  });
});
