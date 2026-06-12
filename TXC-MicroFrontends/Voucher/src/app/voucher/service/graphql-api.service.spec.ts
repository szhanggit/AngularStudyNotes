import { TestBed } from '@angular/core/testing';

import { GraphqlApiService } from './graphql-api.service';
import { HttpClient } from '@angular/common/http';
import { TenantConfigService } from './tenant-config.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphqlApiService', () => {
  let service: GraphqlApiService;
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
    service = TestBed.inject(GraphqlApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call httpClient.post when postQuery is called', () => {
    service.postQuery('test');
    expect(service.httpClient.post).toHaveBeenCalled();
  });

});
