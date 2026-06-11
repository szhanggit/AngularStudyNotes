import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'reimbursementtype' })
export class ReimbursementTypePipe implements PipeTransform {
    transform(key?: number): string | undefined {
        if (key === null) {
            return '--'
        }

        return MERCHANT_CONSTANTS.REIMBURSEMENT_TYPE.find(rt => rt.key === key)?.value;
    }
}