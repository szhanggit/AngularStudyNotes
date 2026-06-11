import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { MerchantService } from './merchant.service';
import { TenantConfigService } from './tenant-config.service';

describe('MerchantService', () => {
  // declare merchant service 
  let service: MerchantService;

  // declare http and tenantCOnfig service mocks
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  beforeEach(() => {
    // setup http to return values
    mockHttp = jasmine.createSpyObj(['get', 'post', 'put']);
    mockHttp.get.and.returnValue(of(true));
    mockHttp.post.and.returnValue(of(true));
    mockHttp.put.and.returnValue(of(true));

    // setup tenant config to setup values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // mock merchant module
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HttpClient,
          useValue: mockHttp
        }, {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        }
      ]
    });
    service = TestBed.inject(MerchantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMerchant', () => {
    it('should call http.get when page is changed', fakeAsync(() => {
      service.page = 1;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when pageSize is changed', fakeAsync(() => {
      service.pageSize = 10;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when searchTerm is changed', fakeAsync(() => {
      service.searchTerm = 'Test';
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when status is changed', fakeAsync(() => {
      service.status = 0;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when merchantId is changed', fakeAsync(() => {
      service.merchantId = 0;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when createdBy is changed', fakeAsync(() => {
      service.createdBy = 0;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));
  });

  describe('getMerchantId', () => {
    it('should call http.get', () => {
      service.getMerchantById(999);

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });

  describe('createMerchant', () => {
    it('should call http.post', () => {
      service.createMerchant({});

      expect(mockHttp.post).toHaveBeenCalled();
    });
  });

  describe('updateMerchant', () => {
    it('should call http.put', () => {
      service.updateMerchant({});

      expect(mockHttp.put).toHaveBeenCalled();
    });
  });
});
