import { Pipe, PipeTransform } from '@angular/core';
import { PRODUCT_CONSTANTS } from '../constants/product-constants';

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