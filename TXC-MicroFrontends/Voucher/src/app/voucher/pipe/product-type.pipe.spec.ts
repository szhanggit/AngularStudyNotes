import { PRODUCT_CONSTANTS, ProductTypePipe } from './product-type.pipe';

describe('ProductTypePipe', () => {
  const pipe = new ProductTypePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return proper value according to the key', () => {
    expect(pipe.transform(1)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[0].value);
    expect(pipe.transform(2)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[1].value);
    expect(pipe.transform(3)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[2].value);
    expect(pipe.transform(4)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[3].value);
    expect(pipe.transform(5)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[4].value);
    expect(pipe.transform(8)).toBe(PRODUCT_CONSTANTS.PRODUCT_TYPE[5].value);
    expect(pipe.transform(0)).toBe('NotFound');
  });
});
