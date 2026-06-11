import { Pipe, PipeTransform } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';

@Pipe({ name: 'issuertype' })
export class IssuerTypePipe implements PipeTransform {
    transform(key?: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case 0:
                return 'IssuerModel';
            case 2:
                return 'ResellerModel';
            case 3:
                return 'WhiteLabel';
            default: return 'NotFound';
        }
    }
}