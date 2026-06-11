import { Injectable } from '@angular/core';
import { ContractSkuStatusEnum, UISkuStatusEnum } from '../enums/merchant-group.enum';
import { ContractSKUCost } from '../models/merchant-group-sku.model';
@Injectable({
  providedIn: 'root'
})
export class MerchantGroupSharedService {

  readonly DATE_SEPAPATOR = '/';
  selectedTenantUTC;

  constructor() {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
  }

  getSkuStatusTag(list: ContractSKUCost[]): string {
    let isSkuValid;
    if (list.every(e => e.contractSkuStatus.id === ContractSkuStatusEnum.Approved) &&
      list.every(e => e.validEndDate ? new Date(e.validEndDate) <= new Date() : false)) {
      isSkuValid = false;
    } else if (list.every(e => e.contractSkuStatus.id !== ContractSkuStatusEnum.Approved) &&
      list.some(e => e.validEndDate ? new Date(e.validEndDate) <= new Date() : false)) {
      isSkuValid = false;
    } else {
      isSkuValid = true;
    }

    if (isSkuValid) {
      if (list.every(e => e.contractSkuStatus.id === ContractSkuStatusEnum.Deleted)) {
        return UISkuStatusEnum.Deleted;
      }
      if (list.some(e => e.contractSkuStatus.id === ContractSkuStatusEnum.Approved)) {
        return UISkuStatusEnum.Approved;
      } else {
        return UISkuStatusEnum.Others;
      }
    }
    else {
      return UISkuStatusEnum.Expired
    }
  }

  // TimeZone 
  getDateByTanentTimeZone(date: Date, time = '00:00:00'): Date {
    if (this.selectedTenantUTC) {
      const today = new Date();
      const y = today.getUTCFullYear();
      const m = today.getUTCMonth() + 1;
      const d = today.getUTCDate();
      const date = new Date(`${y}/${m}/${d} ${time} ${this.selectedTenantUTC}`);
      return date;
    }
    else {
      return date
    }
  }


  convetToUtcIsoString(date: any) {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: any) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      diff + pad(tzOffset / 60) +
      ':' + pad(tzOffset % 60);
  };

  // convert the UI displayed time to match the tenant (BU) time
  convertUserDateToDateWithTanentTimeZone(date: Date) {
    const userLocalOffset = new Date().getTimezoneOffset();
    const tenantOffset = this.getUtcOffsetInMinutes(this.selectedTenantUTC);
    return this.shiftDateTimeByTimezoneOffset(date, tenantOffset, userLocalOffset);
  }

  private getUtcOffsetInMinutes(utcOffset: string): number {
    const [sign, hours, minutes] = utcOffset.match(/^([+-])(\d{2}):?(\d{2})$/)?.slice(1) || [];
    const value = +hours * 60 + +minutes;
    if (value === 0) return 0;
    return sign === '+' ? -value : value;
  }

  private shiftDateTimeByOffsetInMinutes(orignalDate: Date, offsetInMinutes: number): Date {
    const date = new Date(orignalDate);
    return new Date(date.setMinutes(date.getMinutes() + offsetInMinutes));
  }

  private shiftDateTimeByTimezoneOffset(orignalDate: Date, originalTimezoneOffset: number, expectedTimezoneOffset: number): Date {
    const date = new Date(orignalDate);
    const offsetInMinutes = originalTimezoneOffset - expectedTimezoneOffset;
    return new Date(date.setMinutes(date.getMinutes() + offsetInMinutes));
  }


}
