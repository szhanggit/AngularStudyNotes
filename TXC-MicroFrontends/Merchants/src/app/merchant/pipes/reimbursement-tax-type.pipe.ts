import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'reimbursementtaxtype' })
export class ReimbursementTaxTypePipe implements PipeTransform {
    transform(key?: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[0].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[0].value;
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[1].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[1].value;
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[2].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[2].value;
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[3].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TAX_TYPE[3].value;
            default: return 'NotFound';
        }
    }
}