import FS from 'fs';

describe('test myModule', () => {
  it('should return 42', () => {
    let data = FS.readFileSync('./dataTest.zip');

    expect(myModule()).toBe(42);
  });
});
