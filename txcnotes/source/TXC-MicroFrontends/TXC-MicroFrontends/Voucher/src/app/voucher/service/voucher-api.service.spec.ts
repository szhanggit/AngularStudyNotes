import { TestBed } from '@angular/core/testing';

import { VoucherApiService } from './voucher-api.service';
import { HttpClient } from '@angular/common/http';
import { TenantConfigService } from './tenant-config.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraphqlApiService } from './graphql-api.service';
import { environment } from 'src/environments/environment';

describe('VoucherApiService', () => {
  let service: VoucherApiService;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  let mockGraphqlApiService: jasmine.SpyObj<GraphqlApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // setup http to return values
    mockHttp = jasmine.createSpyObj(['get', 'post', 'put']);
    mockHttp.get.and.returnValue(of(true));
    mockHttp.post.and.returnValue(of(true));
    mockHttp.put.and.returnValue(of(true));
    const a = of({
      data: '',
      message: '',
      success: true,
    });
    mockGraphqlApiService = jasmine.createSpyObj(['postQuery']);
    mockGraphqlApiService.postQuery.and.returnValue(a);

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
        },
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: GraphqlApiService,
          useValue: mockGraphqlApiService
        }
      ]
    });
    service = TestBed.inject(VoucherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return url', () => {
    service._getURL();
    expect(service._getURL()).toEqual(`https://${ environment.apiUrl}`);
  });

  it('should call graphqlApiService.postQuery when getVoucherListByGuid is called', () => {
    service.getVoucherListByGuid(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getVoucherListByGcid is called', () => {
    service.getVoucherListByGcid(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getVoucherListByAlias is called', () => {
    service.getVoucherListByAlias(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getVoucherListByVoucherNumber is called', () => {
    service.getVoucherListByVoucherNumber(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  
  it('should call graphqlApiService.postQuery when getVoucherListByEcode is called', () => {
    service.getVoucherListByEcode(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  
  it('should call graphqlApiService.postQuery when getVoucherMemo is called', () => {
    service.getVoucherMemo(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  
  it('should call graphqlApiService.postQuery when getVoucherHistoryDetailsByVoucherIds is called', () => {
    service.getVoucherHistoryDetailsByVoucherIds(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
});
