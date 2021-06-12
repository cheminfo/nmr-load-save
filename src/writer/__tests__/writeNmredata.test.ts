import { readFileSync } from 'fs';
import { writeNmredata } from '../writeNmredata';
import { read } from '../../reader/read';

describe('writeNmredata', () => {
  it('use nmrium file', async () => {
    const path = './src/writer/__tests__/ethylbenzene.nmrium';
    const binary = readFileSync(path);
    const data = await read([{ name: path, binary }]);
    const nmredata = await writeNmredata(data);
    for (let file in nmredata.files) {
        console.log(file)
    }
  });
});
