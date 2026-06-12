import { TestBed } from '@angular/core/testing';

import { NgbDatepickerAdapterService } from './ngb-datepicker-adapter.service';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

describe('NgbDatepickerAdapterService', () => {
  let service: NgbDateParserFormatter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbDateParserFormatter, useClass: NgbDatepickerAdapterService },
      ],
    });
    service = TestBed.inject(NgbDateParserFormatter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('format() should work', () => {
    const formattedDate = '05/03/2023';
    const date = {
      day: 3,
      month: 5,
      year: 2023
    } as NgbDateStruct;
    const result = service.format(date);
    expect(result).toEqual(formattedDate);
    expect(service.format(null)).toEqual('');
  });

  it('parse() should work', () => {
    const formattedDate = '05/03/2023';
    const date = {
      day: 3,
      month: 5,
      year: 2023
    } as NgbDateStruct;
    const result = service.parse(formattedDate);
    expect(result).toEqual(date);
    expect(service.parse('')).toEqual(null);
  });
});
