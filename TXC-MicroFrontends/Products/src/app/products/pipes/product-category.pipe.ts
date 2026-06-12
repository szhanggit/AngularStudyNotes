import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'productcategory' })
export class ProductCategoryPipe implements PipeTransform {
    transform(key: string): string {
        if (key === null) {
            return '--'
        }

        switch (Number.parseInt(key)) {
            case 1:
                return 'Actual';
            case 2:
                return 'Promotional';
            default: 
                return '--';
        }
    }
}