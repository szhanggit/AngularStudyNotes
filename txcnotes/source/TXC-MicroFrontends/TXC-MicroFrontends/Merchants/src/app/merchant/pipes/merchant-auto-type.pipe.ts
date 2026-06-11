import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'merchantautotype' })
export class MerchantAutoTypePipe implements PipeTransform {
    transform(key?: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[0].key:
                return MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[0].value;
            case MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[1].key:
                return MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[1].value;
            case MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[2].key:
                return MERCHANT_CONSTANTS.MERCHANT_AUTO_TYPE[2].value;
            default: return 'NotFound';
        }
    }
}