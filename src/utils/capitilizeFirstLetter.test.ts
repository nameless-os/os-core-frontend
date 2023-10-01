import { capitalizeFirstLetter } from '@Utils/capitalizeFirstLetter';

describe('capitalizeFirstLetter test', () => {
  it('should return input if input is empty', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  it('should return input if input is not empty', () => {
    const result = capitalizeFirstLetter('collapse');
    expect(result).toBe('Collapse');
  });
});
