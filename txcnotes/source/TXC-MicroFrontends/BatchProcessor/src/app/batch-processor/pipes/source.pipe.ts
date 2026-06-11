import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'source',
})
export class SourcePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Manual';
      case 2:
        return 'Automatic';
      default:
        return '';
    }
  }
}
