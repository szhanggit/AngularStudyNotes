import { SourcePipe } from './source.pipe';

describe('SourcePipe', () => {
  it('create an instance', () => {
    const pipe = new SourcePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform 1 to "Manual"', () => {
    const pipe = new SourcePipe();
    expect(pipe.transform(1)).toBe('Manual');
  });

  it('should transform 2 to "Automatic"', () => {
    const pipe = new SourcePipe();
    expect(pipe.transform(2)).toBe('Automatic');
  });

  it('should return an empty string for values other than 1 or 2', () => {
    const pipe = new SourcePipe();
    expect(pipe.transform(3)).toBe('');
  });
});
