import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'reimbursementtype' })
export class ReimbursementTypePipe implements PipeTransform {
    transform(key: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[1].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[1].value;
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[2].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[2].value;
            case MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[3].key:
                return MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE[3].value;
            default: 
                return 'NotFound';
        }
    }
}