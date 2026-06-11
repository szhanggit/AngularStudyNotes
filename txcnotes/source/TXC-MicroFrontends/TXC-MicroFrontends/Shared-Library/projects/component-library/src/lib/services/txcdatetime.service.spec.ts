import { TestBed } from '@angular/core/testing';
import { TxcDateTimeService } from './txcdatetime.service';


describe('TxcDateTimeService', () => {
  let service: TxcDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TxcDateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
