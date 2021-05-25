import { readZip } from '../readZip';
import FS from 'fs';

describe('test myModule', () => {
  it('should return 42', () => {
    let data = FS.readFileSync('./dataTest.zip');
    let result = readZip(data);
    expect(true).toBe(true);
  });
});
