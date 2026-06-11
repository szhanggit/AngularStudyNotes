import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'issuertype' })
export class IssuerTypePipe implements PipeTransform {
    transform(key: string): string {
        if (key === null) {
            return '--'
        }

        switch (Number.parseInt(key)) {
            case 0:
                return 'IssuerModel';
            case 2:
                return 'ResellerModel';
            case 3:
                return 'WhiteLabel';
            default: 
                return '--';
        }
    }
}