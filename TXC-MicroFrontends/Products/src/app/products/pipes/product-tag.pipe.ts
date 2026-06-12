import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'producttag' })
export class ProductTagPipe implements PipeTransform {
    transform(key: string): string {
        if (key === null) {
            return '--'
        }

        switch (Number.parseInt(key)) {
            case 1:
                return 'Delivery';
            case 2:
                return 'Paper';
            case 4:
                return 'Digital';
            default: 
                return '--';
        }
    }
}