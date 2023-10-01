import { deleteAllSpaces } from '@Utils/deleteAllSpaces';

describe('deleteAllSpaces test', () => {
  it('should work correctly if input has one space', () => {
    const result = deleteAllSpaces('Hello World');
    expect(result).toBe('HelloWorld');
  });

  it('should work correctly if input has more that one space', () => {
    const result = deleteAllSpaces('It is a big table');
    expect(result).toBe('Itisabigtable');
  });

  it('should work correctly if input has more that one space in a row', () => {
    const result = deleteAllSpaces('  It   is   a big   table  ');
    expect(result).toBe('Itisabigtable');
  });
});
