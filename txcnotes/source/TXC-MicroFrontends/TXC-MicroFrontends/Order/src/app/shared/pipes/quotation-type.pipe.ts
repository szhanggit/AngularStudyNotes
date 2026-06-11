import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'quotationtype' })
export class QuotationTypePipe implements PipeTransform {
    transform(key: number): string {
        switch(key) {
            case 1: return 'Open';
            default: return 'Close';
        }
    }
}