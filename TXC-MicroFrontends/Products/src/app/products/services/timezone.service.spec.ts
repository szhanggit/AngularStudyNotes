import { TestBed } from '@angular/core/testing';

import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {
  let service: TimezoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimezoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getUtcOffsetInMinutes
  it('getUtcOffsetInMinutes("+08:00") should equal to -480', () => {
    const utcOffset = "+08:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(-480);
  });
  it('getUtcOffsetInMinutes("+05:30") should equal to -330', () => {
    const utcOffset = "+05:30";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(-330);
  });
  it('getUtcOffsetInMinutes("+07:00") should equal to -420', () => {
    const utcOffset = "+07:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(-420);
  });
  it('getUtcOffsetInMinutes("+09:00") should equal to -540', () => {
    const utcOffset = "+09:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(-540);
  });
  it('getUtcOffsetInMinutes("-08:00") should equal to 480', () => {
    const utcOffset = "-08:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(480);
  });
  it('getUtcOffsetInMinutes("+00:00") should equal to 0', () => {
    const utcOffset = "+00:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(0);
  });
  it('getUtcOffsetInMinutes("-00:00") should equal to 0', () => {
    const utcOffset = "-00:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(0);
  });
  it('getUtcOffsetInMinutes("08:00") should equal to NaN', () => {
    const utcOffset = "08:00";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(NaN);
  });
  it('getUtcOffsetInMinutes("ABC") should equal to NaN', () => {
    const utcOffset = "ABC";
    let result = service.getUtcOffsetInMinutes(utcOffset);
    expect(result).toEqual(NaN);
  });

  // shiftDateTimeByOffsetInMinutes
  it('shiftDateTimeByOffsetInMinutes(Date(2023,3,20,2,0,0,0), -150) should equal to Date(2023,03,19,23,30,00)', () => {
    const offset = -150;
    const originalDate = new Date(2023,3,20, 2, 0,0,0);
    const expectedDate = new Date(2023,3,19,23,30,0,0);
    let result = service.shiftDateTimeByOffsetInMinutes(originalDate, offset);
    expect(result).toEqual(expectedDate);
  });
  it('shiftDateTimeByOffsetInMinutes(Date(2023,3,20,2,0,0,0), 60) should equal to Date(2023,3,20,3,0,0,0)', () => {
    const offset = 60;
    const originalDate = new Date(2023,3,20, 2, 0,0,0);
    const expectedDate = new Date(2023,3,20, 3, 0,0,0);
    let result = service.shiftDateTimeByOffsetInMinutes(originalDate, offset);
    expect(result).toEqual(expectedDate);
  });

  // shiftDateTimeByTimezoneOffset
  it('shiftDateTimeByTimezoneOffset(Date(2023,3,20,2,0,0,0), -480, -330) should equal to Date(2023,03,19,23,30,00)', () => {
    const originalDate = new Date(2023,3,20, 2, 0,0,0);
    const expectedDate = new Date(2023,3,19,23,30,0,0);
    let result = service.shiftDateTimeByTimezoneOffset(originalDate, -480, -330);
    expect(result).toEqual(expectedDate);
  });

  // shiftDateTimeByUtcOffset
  it('shiftDateTimeByUtcOffset(Date(2023,3,20,2,0,0,0), "+05:30") should work', () => {
    const originalDate = new Date(2023,3,20, 2, 0,0,0);
    const utcOffset = "+05:30";
    let result = service.shiftDateTimeByUtcOffset(originalDate, utcOffset);
    const diff = result.getTime() - originalDate.getTime();
    const expected = (originalDate.getTimezoneOffset() - service.getUtcOffsetInMinutes(utcOffset)) * 60 * 1000;
    expect(diff).toEqual(expected);
  });

});
