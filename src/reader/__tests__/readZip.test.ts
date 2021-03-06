import FS from 'fs';
import { join } from 'path';

import { Spectrum1D } from '../../../types/Spectra/Spectrum1D';
import { readZip } from '../readZip';

describe('test myModule', () => {
  it('should return 42', async () => {
    let data = FS.readFileSync(join('./src/reader/__tests__/dataTest.zip'));
    let result = await readZip(data);
    expect(result.spectra).toHaveLength(2);
    expect(result.molecules).toHaveLength(1);
    let spectrum0 = result.spectra[0] as Spectrum1D;
    expect(spectrum0.data.x).toHaveLength(16384);
    expect(spectrum0.info.isFid).toBe(true);
    expect(spectrum0.info.solvent).toBe('CDCl3');
    let spectrum1 = result.spectra[1] as Spectrum1D;
    expect(spectrum1.data.x).toHaveLength(8192);
    expect(spectrum1.info.solvent).toBe('Acetone');
  });
});
