import { OrderModeTypePipe } from './order-mode-type.pipe';
import { OrderModeEnum } from '../enums/order-mode.enum';

describe('OrderModeTypePipe: ', () => {
  const pipe = new OrderModeTypePipe();

  describe('should transform value', () => {
    it('for Indirect Non API ', () => {
      // arrange
      const expectedValue = 'NonAPI + Indirect';

      // act
      const actualValue = pipe.transform(OrderModeEnum.IndirectNonAPI);

      // assert
      expect(actualValue).toBe(expectedValue);
    });

    it('for Direct Non API ', () => {
      // arrange
      const expectedValue = 'NonAPI + Direct';

      // act
      const actualValue = pipe.transform(OrderModeEnum.DirectNonAPI);

      // assert
      expect(actualValue).toBe(expectedValue);
    });

    it('for API ', () => {
      // arrange
      const expectedValue = 'API';

      // act
      const actualValue = pipe.transform(OrderModeEnum.API);

      // assert
      expect(actualValue).toBe(expectedValue);
    });

    it('for Paper Voucher ', () => {
      // arrange
      const expectedValue = 'Paper Voucher';

      // act
      const actualValue = pipe.transform(OrderModeEnum.PaperVoucher);

      // assert
      expect(actualValue).toBe(expectedValue);
    });

    it('for Not Found ', () => {
        // arrange
        const expectedValue = 'Not Found';
  
        // act
        const actualValue = pipe.transform(12);
  
        // assert
        expect(actualValue).toBe(expectedValue);
      });
  });
});
