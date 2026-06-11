import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TxcDateTimeService {

  selectedTenantUTC!: string;
  datetimeFormat = 'yyyy/MM/dd hh:mm:ss a';
  
  constructor(@Inject(LOCALE_ID) public locale: string) { }

  getLocalDateTime(utcDate: string | number | Date) {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
      return formatDate(utcDate, this.datetimeFormat, this.locale, this.selectedTenantUTC);
    } else {
      return '--'
    }
  }

  getUtcDateTime(localDate: Date) {
    if(localDate) {
      const tenantFromLocalStorage = localStorage.getItem('tenant');
      if (tenantFromLocalStorage) {
        let offset = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
        const operator = offset.split('')[0];
        const valueOffset = offset.split(/[\:+-]+/).filter((num:string) => num);
        if(operator === '+'){
          localDate.setHours(localDate.getHours() - parseInt(valueOffset[0]));
          localDate.setMinutes(localDate.getMinutes() - parseInt(valueOffset[1]));
        }else{
          localDate.setHours(localDate.getHours() + parseInt(valueOffset[0]));
          localDate.setMinutes(localDate.getMinutes() + parseInt(valueOffset[1]));
        }
        let utcString = localDate.toLocaleString('en-US') + ' UTC ';
        return new Date(utcString).toISOString();
      } else {
        return '--'
      }
    } else{
      return 'Invalid Date Value'
    } 
  }
}
