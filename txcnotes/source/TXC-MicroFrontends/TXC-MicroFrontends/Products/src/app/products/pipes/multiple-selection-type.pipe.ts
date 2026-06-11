import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'multipleselectiontype' })
export class MultipleSelectionTypePipe implements PipeTransform {
    transform(key: string): string {
        if (key === null) {
            return '--'
        }

        switch (Number.parseInt(key)) {
            case 1:
                return 'Master';
            case 2:
                return 'Child';
            default: 
                return '--';
        }
    }
}