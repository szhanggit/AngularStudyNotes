import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intervalUnit'
})
export class IntervalUnitPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == undefined) {
      return '--';
    }
    
    value = Number.parseInt(value.toString());
    switch (value) {
      case 1:
        return 'Hours'
      case 2:
        return 'Days'
      case 3: 
        return 'Minutes'
      default:
        return '--';
    } 
  }
}
