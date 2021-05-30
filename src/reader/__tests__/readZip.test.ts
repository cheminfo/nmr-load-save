import FS from 'fs';
import { join, resolve } from 'path';

import { readZip } from '../readZip';

describe('test myModule', () => {
  it('should return 42', async () => {
    let data = FS.readFileSync(join('./src/reader/__tests__/dataTest.zip'));
    let result = await readZip(data);
    expect(result.spectra).toHaveLength(2);
    expect(result.molecules).toHaveLength(1);
  });
});
