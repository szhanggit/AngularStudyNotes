import { Pipe, PipeTransform } from '@angular/core';
import { PRODUCT_CONSTANTS } from '../constants/product-constants';

@Pipe({ name: 'merchantacquirer' })
export class MerchantAcquirerPipe implements PipeTransform {
    transform(key: number): string {
        switch (key) {
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[0].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[0].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[1].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[1].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[2].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[2].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[3].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[3].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[4].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[4].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[5].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[5].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[6].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[6].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[7].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[7].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[8].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[8].value;
            case PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[9].key:
                return PRODUCT_CONSTANTS.MERCHANT_ACQUIRER[9].value;
            default: return 'NotFound';
        }
    }
}