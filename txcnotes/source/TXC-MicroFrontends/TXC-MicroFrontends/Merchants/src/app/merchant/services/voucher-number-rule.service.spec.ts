import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TenantConfigService } from './tenant-config.service';

import { VoucherNumberRuleService } from './voucher-number-rule.service';

describe('VoucherNumberRuleService', () => {
  // declare vnr service
  let service: VoucherNumberRuleService;

  // declare mock services for http and tenantCOnfig service
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;

  beforeEach(() => {
    // setup http to return values
    mockHttp = jasmine.createSpyObj(['get', 'post', 'put']);
    mockHttp.get.and.returnValue(of(true));
    mockHttp.post.and.returnValue(of(true));
    mockHttp.put.and.returnValue(of(true));

    // setup tenantConfig to return values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ], providers: [
        {
          provide: HttpClient,
          useValue: mockHttp
        }, {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        }
      ]
    });
    service = TestBed.inject(VoucherNumberRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVoucherNumberRuleAlgorithm', () => {
    it('should call http.get to retrieve data', () => {
      service.getVoucherNumberRuleAlgorithm();

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });

  describe('getVoucherNumberRuleBarCode', () => {
    it('should call http.get to retrieve data', () => {
      service.getVoucherNumberRuleBarCode();

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });

  describe('getVoucherNumberRulePinCode', () => {
    it('should call http.get to retrieve data', () => {
      service.getVoucherNumberRulePinCode();

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });

  describe('getVoucherNumberRuleVoucherGenerator', () => {
    it('should call http.get to retrieve data', () => {
      service.getVoucherNumberRuleVoucherGenerator();

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });
});
