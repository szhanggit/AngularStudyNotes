import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  constructor() {}

  /**
   * Gets the difference in minutes between the time zone represented by the given utcOffset string and Universal Coordinated Time (UTC).
   * @param utcOffset A string representing the offset between UTC. (Ex. "+08:00" for UTC+8, "+05:30" for UTC+5:30, "-08:00" for UTC-8)
   * @returns A number which is the difference in minutes between the time zone represented by the given utcOffset string and UTC.
   * (Ex. Given "+08:00" and it would return -480.)
   */
  getUtcOffsetInMinutes(utcOffset: string): number {
    const [sign, hours, minutes] =
      utcOffset.match(/^([+-])(\d{2}):?(\d{2})$/)?.slice(1) || [];
    const value = +hours * 60 + +minutes;
    if (value === 0) return 0;
    return sign === '+' ? -value : value;
  }

  /**
   * Shifts the given date by the given offset (in minutes).
   * @param orignalDate A date object to be the base time before shifting.
   * @param offsetInMinutes A number representing the offset in minutes to be used for shifting.
   * @returns A new date which is the result of shifting the given date by the given offset (in minutes).
   */
  shiftDateTimeByOffsetInMinutes(
    orignalDate: Date,
    offsetInMinutes: number
  ): Date {
    const date = new Date(orignalDate);
    return new Date(date.setMinutes(date.getMinutes() + offsetInMinutes));
  }

  /**
   * Shifts the given date by the difference between originalTimezoneOffset (in minutes) and expectedTimezoneOffset (in minutes).
   * @param orignalDate A date object to be the base time before shifting.
   * @param originalTimezoneOffset A number representing the time zone offset between UTC (in minutes).
   * @param expectedTimezoneOffset A number representing the time zone offset between UTC (in minutes).
   * @returns A new date which is the result of shifting the given date by the difference between originalTimezoneOffset (in minutes)
   * and expectedTimezoneOffset (in minutes).
   */
  shiftDateTimeByTimezoneOffset(
    orignalDate: Date,
    originalTimezoneOffset: number,
    expectedTimezoneOffset: number
  ): Date {
    const date = new Date(orignalDate);
    const offsetInMinutes = originalTimezoneOffset - expectedTimezoneOffset;
    return new Date(date.setMinutes(date.getMinutes() + offsetInMinutes));
  }

  /**
   * Shifts the given date by the difference between the user local time zone offset (in minutes)
   * and the time zone offset (in minutes) of the given utcOffset string.
   * @param orignalDate A date object to be the base time before shifting.
   * @param expectedUtcOffset A string representing the offset between UTC. (Ex. "+08:00" for UTC+8)
   * @returns A new date which is the result of shifting the given date by the difference
   * between the user local time zone offset (in minutes) and the time zone offset (in minutes) of the given utcOffset string.
   */
  shiftDateTimeByUtcOffset(
    originalDate: Date,
    expectedUtcOffset: string,
  ): Date {
    const dateAndOffset = this.getDateAndOffset(
      originalDate,
      expectedUtcOffset
    );
    
    return new Date(
      dateAndOffset.date.setMinutes(
        dateAndOffset.date.getMinutes() + dateAndOffset.offset
      )
    );
  }

  shiftDateTimeByUtcOffsetFromDatepicker(
    originalDate: string,
    expectedUtcOffset: string
  ): Date {
    const dateAndOffset = this.getDateAndOffset(
      originalDate,
      expectedUtcOffset
    );

    dateAndOffset.date.setHours(23);
    dateAndOffset.date.setMinutes(59);
    dateAndOffset.date.setSeconds(59);

    return new Date(
      dateAndOffset.date.setMinutes(
        dateAndOffset.date.getMinutes() - dateAndOffset.offset
      )
    );
  }

  private getDateAndOffset(originalDate: Date | string, expectedUtcOffset: string) {
    const date = new Date(originalDate);
    const expectedTimezoneOffset =
      this.getUtcOffsetInMinutes(expectedUtcOffset);
    const originalTimezoneOffset = date.getTimezoneOffset();

    return {
      date: date,
      offset: originalTimezoneOffset - expectedTimezoneOffset,
    };
  }
}
