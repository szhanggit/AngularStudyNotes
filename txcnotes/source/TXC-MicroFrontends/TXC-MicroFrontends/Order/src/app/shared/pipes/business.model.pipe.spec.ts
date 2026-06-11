import { BusinessModelPipe } from './business.model.pipe';

describe('BusinessModelPipe: ', () => {
  const pipe = new BusinessModelPipe();

  it('should transform', () => {
    // act
    const actualValue = pipe.transform(1);

    // assert
    expect(actualValue).toBe('Prepaid');
  });
});
