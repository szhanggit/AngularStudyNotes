import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//This is common service contains utility methods use by client service
export class UtilityService {  
  //It is used for fetch local time offset.
  FetchLocalTimeFromUTC()
  {
    let selectedTenantUTC!: string;
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      return JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
    return selectedTenantUTC;
  }
  getDateOnly(date : string): Date{
    return new Date(date.slice(0, 10));
  }
}
