import { QuotationTypePipe } from './quotation-type.pipe';

describe('QuotationPipe: ', () => {
  const pipe = new QuotationTypePipe();

  it('should transform', () => {
    // act
    const actualValue = pipe.transform(1);

    // assert
    expect(actualValue).toBe('Open');
  });
});
