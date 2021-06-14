import { bruker } from 'bruker-data-test';
import { jcamp } from 'jcamp-data-test';
import { nmredata } from 'nmredata-data-test';
import { experiments as jeol } from 'jeol-data-test';

import { Spectrum1D } from '../../../types/Spectra/Spectrum1D';
import { Spectrum2D } from '../../../types/Spectra/Spectrum2D';
import { read } from '../read';

describe('read by extension', () => {
  it('jcamp', async () => {
    let jcampData = jcamp['aspirin-1h.dx'];
    let result = await read({
      name: 'aspirin-1h.dx',
      extension: 'dx',
      binary: jcampData,
    });
    const spectrum = result.spectra[0] as Spectrum1D;
    expect(spectrum.info.isFid).toBe(false);
    expect(spectrum.data.x).toHaveLength(32 * 1024);
    expect(spectrum.info.solvent).toBe('CDCl3');
  });
  it('Bruker', async () => {
    let brukerData = bruker['aspirin-1h.zip'];
    let result = await read(
      {
        name: 'aspirin-1h.zip',
        extension: 'zip',
        binary: brukerData,
      },
      { base64: true },
    );
    const spectrum = result.spectra[0] as Spectrum1D;
    expect(spectrum.info.isFid).toBe(true);
    expect(spectrum.data.x).toHaveLength(16384);
    expect(spectrum.info.solvent).toBe('CDCl3');
  });

  it('nmredata', async () => {
    let data = nmredata['generated.zip'];
    let result = await read(
      {
        name: 'generated.nmredata',
        binary: data,
      },
      { base64: true },
    );
    expect(result.molecules).toHaveLength(1);
    expect(result.spectra).toHaveLength(2);
    expect(result.molecules[0].molfile.includes('CCc1ccccc1')).toBe(true);
  });

  it('jeol', async () => {
    const data = jeol['Rutin_3080ug200uL_DMSOd6_HSQC_400MHz_Jeol.jdf'];
    let result = await read({
      name: 'jeol.jdf',
      binary: data,
    });
    const spectrum = result.spectra[0] as Spectrum2D;
    expect(spectrum.info.nucleus[0]).toStrictEqual('1H');
    expect(spectrum.info.nucleus[1]).toStrictEqual('13C');
    expect(spectrum.data.z[0]).toHaveLength(4096);
  });
});
