import { Pipe, PipeTransform } from '@angular/core';
import { TxcDateTimeService } from '../services/txcdatetime.service';

@Pipe({
  name: 'txcLocalDateTime'
})
export class TxcDateTimePipe implements PipeTransform {

  constructor(private txcDateTimeService : TxcDateTimeService) {}
  transform(value: Date | string | number | null | undefined): string|null {
    if (value == null || value === '' || value !== value) return null;
    return this.txcDateTimeService.getLocalDateTime(value);
  }

}
