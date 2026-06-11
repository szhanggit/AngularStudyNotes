import { Injectable } from '@angular/core';
import { SkuTypeEnum } from '../constants/sku_constant';

@Injectable({
  providedIn: 'root'
})

//This is common service contains utility methods use by merchant service
export class UtilityService {
  /// <summary>
  /// This method accept 2 argument list of validation erros and object of toast and display unique  validation messages return by API in toaster
  /// </summary>
  ShowUniqueValidationErrors(validationErrors:string[],toast:any)
  {
    //This method return unique rows of validation  errors returned by API    
    var isObject = validationErrors.some(value => { return typeof value == "object" } );
    let uniqueValidationErrors;
    if(isObject)
    {
       uniqueValidationErrors= Array.from(new Set(validationErrors.map((item:any) => item.errorMessage)));;
    }
    else
    {
      uniqueValidationErrors = Array.from(new Set(validationErrors.map((item:any) => item)));;
    }
    for (let index = 0; index < uniqueValidationErrors.length; index++) {
      const element = uniqueValidationErrors[index];      
      toast?.showDanger(element);
    }    
  }  
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

  getUtcOffsetInMinutes(utcOffset: string): number {
    const [sign, hours, minutes] = utcOffset.match(/^([+-])(\d{2}):?(\d{2})$/)?.slice(1) || [];
    const value = +hours * 60 + +minutes;
    if (value === 0) return 0;
    return sign === '+' ? -value : value;
  }

  shiftDateTimeByUtcOffset(originalDate: Date, expectedUtcOffset: string): Date {
    const date = new Date(originalDate);
    const originalTimezoneOffset = date.getTimezoneOffset();
    const expectedTimezoneOffset = this.getUtcOffsetInMinutes(expectedUtcOffset);
    const offsetInMinutes = originalTimezoneOffset - expectedTimezoneOffset;
    return new Date(date.setMinutes(date.getMinutes() + offsetInMinutes));
  }
  checkValidSKUStatus(type : any) : boolean{
    let stats = JSON.parse(localStorage.getItem('tenant')||"{}");
    if( stats.name == "IN" && type.replace(" ","") == SkuTypeEnum[SkuTypeEnum.ValueBased] ) return true;
    return false;
  }
}
