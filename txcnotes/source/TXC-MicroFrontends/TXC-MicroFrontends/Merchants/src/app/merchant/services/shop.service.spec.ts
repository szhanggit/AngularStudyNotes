import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { ShopService } from './shop.service';
import { TenantConfigService } from './tenant-config.service';

describe('ShopService', () => {
  // declare shop service
  let service: ShopService;

  // declare mock services for http and tenantConfigService
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
    service = TestBed.inject(ShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getShops', () => {
    beforeEach(() => {
      service.merchantId = 1;
    });

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
      service.merchantId = 2;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));

    it('should call http.get when createdBy is changed', fakeAsync(() => {
      service.createdBy = 0;
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));
  });

  describe('getShop', () => {
    it('should call http.get', () => {
      service.getShop(999);

      expect(mockHttp.get).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call http.get', fakeAsync(() => {
      service.merchantId = 1;
      service.refresh();
      tick(2000);

      expect(mockHttp.get).toHaveBeenCalled();
    }));
  });

  describe('createShop', () => {
    it('should call http.post', () => {
      service.createShop({});

      expect(mockHttp.post).toHaveBeenCalled();
    });
  });

  describe('updateShop', () => {
    it('should call http.put', () => {
      service.updateShop({});

      expect(mockHttp.put).toHaveBeenCalled();
    });
  });
});
