import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'autocreatereimbursementday' })
export class AutoCreateReimbursementDayPipe implements PipeTransform {
    transform(key: number): string {
        if (key === null) {
            return '--'
        }

        switch (key) {
            case 0:
                return 'End Of Month';
            default: 
                return `${key}`;
        }
    }
}