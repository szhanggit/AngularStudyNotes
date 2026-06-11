import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'standardCase' })
export class StandardCasePipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    return (
      value.substring(0, 1).toUpperCase() +
      value.substring(1).toLowerCase().split('_').join(' ')
    );
  }
}
