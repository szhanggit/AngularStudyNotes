import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TxcDateTimeService } from '@txc-angular/component-library';

@Injectable({
  providedIn: 'root'
})
export class VoucherGeneralService {

  constructor(
    public txcDateTimeService: TxcDateTimeService,
  ) { }

  UTCDateToNgbDate(UTCDateString: string): NgbDateStruct | null {
    if(UTCDateString) {
      const date = new Date(UTCDateString);
      return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
   return null;
  }
  
  ngbDateToUTCDate(ngbDate: NgbDateStruct | null, isEndDate: boolean = false): string | null {
    if(ngbDate) {
      const time = isEndDate ? ' 23:59:59' : ' 00:00:00';
      const localDate = new Date(ngbDate.year + "-" + ((ngbDate.month).toString().padStart(2, '0')) + "-" + ngbDate.day.toString().padStart(2, '0') + time);
      const UTCDate = this.txcDateTimeService.getUtcDateTime(localDate);
      return UTCDate;
    }
    return null;
  }
}
