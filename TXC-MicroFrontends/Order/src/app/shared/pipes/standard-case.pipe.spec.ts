import { StandardCasePipe } from './standard-case.pipe';

describe('StandardCasePipe: ', () => {
  const pipe = new StandardCasePipe();

  it('should return empty', () => {
    // act
    const actualValue = pipe.transform();

    // assert
    expect(actualValue).toBe('');
  });

  it('should transform', () => {
    // act
    const actualValue = pipe.transform('product_Name');

    // assert
    expect(actualValue).toBe('Product name');
  });
});
