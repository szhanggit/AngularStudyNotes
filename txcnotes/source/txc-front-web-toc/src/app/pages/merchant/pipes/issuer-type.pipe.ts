import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'issuertype' })
export class IssuerTypePipe implements PipeTransform {
    transform(key: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.ISSUER_TYPE[0].key:
                return MERCHANT_CONSTANTS.ISSUER_TYPE[0].value;
            case MERCHANT_CONSTANTS.ISSUER_TYPE[2].key:
                return MERCHANT_CONSTANTS.ISSUER_TYPE[2].value;
            case MERCHANT_CONSTANTS.ISSUER_TYPE[3].key:
                return MERCHANT_CONSTANTS.ISSUER_TYPE[3].value;
            default: return 'NotFound';
        }
    }
}