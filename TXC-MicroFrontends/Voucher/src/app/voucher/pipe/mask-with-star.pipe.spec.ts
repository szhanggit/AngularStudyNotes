import { MaskWithStarPipe } from './mask-with-star.pipe';

describe('MaskWithStarPipe', () => {
  const pipe = new MaskWithStarPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  /**
   * Test different types of input
   */
  it('should mask the first 3 words of string begin from first word when input "first-0-3"', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'first-0-3')).toBe('***defg123456');
  });
  it('should mask the last 3 words of string begin from first word when input "last-0-3"', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'last-0-3')).toBe('abcdefg123***');
  });
  it('should mask the 3 words of string begin from the first 3rd word when input "first-3-3"', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'first-3-3')).toBe('abc***g123456');
  });
  it('should mask the 3 words of string begin from from the last 3rd  word when input "last-3-3"', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'last-3-3')).toBe('abcdefg***456');
  });
  it('should return "--" when input nothing', () => {
    const dummyString = '';
    expect(pipe.transform(dummyString, 'first-0-3')).toBe('--');
  });


  it('should show all mask stars when the string lenth is less than mask number', () => {
    const dummyString = 'a';
    expect(pipe.transform(dummyString, 'last-3-3')).toBe('***');
  });

  it('should show all mask stars when the string lenth is less than mask number', () => {
    const dummyString = 'abcd';
    expect(pipe.transform(dummyString, 'last-3-3')).toBe('***bcd');
  });

  it('should use type "first" when the type is not "first" or "last"', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'less-3-3')).toBe('abc***g123456');
  });

  it('should use default input(first-0-1) when there is not input', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString)).toBe('*bcdefg123456');
  });

  it('should do nothing if the input can not be recognized', () => {
    const dummyString = 'abcdefg123456';
    expect(pipe.transform(dummyString, 'transcc-c')).toBe('abcdefg123456');
  });


});
