import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'autocreatereimbursement' })
export class AutoCreateReimbursementPipe implements PipeTransform {
    transform(key?: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE[0].key:
                return MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE[0].value;
            case MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE[1].key:
                return MERCHANT_CONSTANTS.AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE[1].value;
            default: return 'NotFound';
        }
    }
}