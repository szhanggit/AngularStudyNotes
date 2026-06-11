import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'producttype' })
export class ProductTypePipe implements PipeTransform {
  transform(key: number): string {
    switch (key) {
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[0].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[0].value;
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[1].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[1].value;
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[2].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[2].value;
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[3].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[3].value;
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[4].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[4].value;
      case PRODUCT_CONSTANTS.PRODUCT_TYPE[5].key:
        return PRODUCT_CONSTANTS.PRODUCT_TYPE[5].value;
      default: return 'NotFound';
    }
  }
}

export const PRODUCT_CONSTANTS = {
  PRODUCT_TYPE: [
      { key: 1, value: 'Product based' },
      { key: 2, value: 'Value based' },
      { key: 3, value: 'Smart Booklet' },
      { key: 4, value: 'Dynamic Face Value' },
      { key: 5, value: 'Smart Choice Voucher' },
      { key: 8, value: 'Super Voucher' }
  ],
}
