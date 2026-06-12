import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'islegacymerchant' })
export class IsLegacyMerchantPipe implements PipeTransform {
    transform(key: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.IS_LEGACY_MERCHANT[0].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[0].value;
            case MERCHANT_CONSTANTS.IS_LEGACY_MERCHANT[1].key:
                return MERCHANT_CONSTANTS.IS_LEGACY_MERCHANT[1].value;
            default: return 'NotFound';
        }
    }
}