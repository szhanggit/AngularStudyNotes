import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateFormat'
})
export class LocalDateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(new Date(value.slice(0, 10)), "yyyy/MM/dd");
  }
}
