import { TestBed } from '@angular/core/testing';
import { VoucherGeneralService } from './voucher-general.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TenantConfigService } from './tenant-config.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TxcDateTimeService } from '@txc-angular/component-library';

describe('VoucherGeneralService', () => {
  let service: VoucherGeneralService;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  // setup tenant config to setup values
  mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
  mockTenantConfigService.getTenant.and.returnValue({
    id: 7,
    name: 'TW'
  });
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      TxcDateTimeService,
      {
        provide: TenantConfigService,
        useValue: mockTenantConfigService
      },
    ]
  });
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transfer to NgbDateStruct when calling UTCDateToNgbDate', () => {
    const dateString = '2019-06-04'
    const date = service.UTCDateToNgbDate(dateString);
    const expectDate: NgbDateStruct = {
      year: 2019,
      month: 6,
      day: 4
    }
    expect(date).toEqual(expectDate);
  });
  it('should return null when calling UTCDateToNgbDate with nothing', () => {
    const dateString = ''
    const date = service.UTCDateToNgbDate(dateString);
    expect(date).toBeNull();
  });

  it('should return string  when calling ngbDateToUTCDate with ngbDate', () => {
    spyOn(TestBed.inject(TxcDateTimeService), 'getUtcDateTime');
    const ngbDate: NgbDateStruct = {
      year: 2020,
      month: 5,
      day: 4
    };    
    service.ngbDateToUTCDate(ngbDate);
    expect(service.txcDateTimeService.getUtcDateTime).toHaveBeenCalled();
  });
  it('should return null when calling ngbDateToUTCDate with null', () => {
    const dateString = null;
    const date = service.ngbDateToUTCDate(dateString);
    expect(date).toBeNull();
  });


});
