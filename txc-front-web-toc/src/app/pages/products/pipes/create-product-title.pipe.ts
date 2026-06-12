import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'createproducttitle'})
export class CreateProuductTitlePipe implements PipeTransform {
  transform(type: string): string {
    if (type) {
        return `Create Product (${type})`;
    } else {
        return 'Create Product';
    }
  }
}