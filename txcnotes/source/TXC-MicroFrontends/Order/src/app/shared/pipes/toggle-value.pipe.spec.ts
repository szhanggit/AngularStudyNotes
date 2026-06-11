import { ToggleValuePipe } from './toggle-value.pipe';

describe('ToggleValuePipe: ', () => {
  const pipe = new ToggleValuePipe();

  it('should transform true to yes', () => {
    // act
    const actualValue = pipe.transform(true);

    // assert
    expect(actualValue).toBe('Yes');
  });

  it('should transform false to no', () => {
    // act
    const actualValue = pipe.transform(false);

    // assert
    expect(actualValue).toBe('No');
  });
});
