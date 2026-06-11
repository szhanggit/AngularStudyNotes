import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryApiService } from './inventory-api.service';
import { TenantConfigService } from './tenant-config.service';
import { GraphqlApiService } from './graphql-api.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { SkuDetailSourceTypeEnum } from '../enum/product-type.enum';
import { getInventoryListRequestInterface } from '../interface/request-interface';
import { environment } from 'src/environments/environment';

describe('InventoryApiService', () => {
  let service: InventoryApiService;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  let mockGraphqlApiService: jasmine.SpyObj<GraphqlApiService>;
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
    const a = of({
      data: '',
      message: '',
      success: true,
    });
    mockGraphqlApiService = jasmine.createSpyObj(['postQuery']);
    mockGraphqlApiService.postQuery.and.returnValue(a);
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
    service = TestBed.inject(InventoryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return url', () => {
    service._getURL();
    expect(service._getURL()).toEqual(`https://${ environment.apiUrl}`);
  });

  it('should call graphqlApiService.postQuery when getProductListBySkuId is called', () => {
    service.getProductListBySkuId(1, 100);
    // console.log(api);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled;
  })

  it('should call graphqlApiService.postQuery when getSkuDetailsBySkuId is called', () => {
    service.getSkuDetailsBySkuId(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getTpcInventory is called', () => {
    service.getTpcInventory(1, 1, 1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getImportInventory is called', () => {
    service.getImportInventory(1, 1, 1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getEdenredInventory is called', () => {
    service.getEdenredInventory(1, 1, 1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getEdenredInventory is called', () => {
    service.getEdenredInventory(1, 1, 1, '1');
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getEdenredRemainingQtyByReservationCode is called', () => {
    service.getEdenredRemainingQtyByReservationCode(1, '1');
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getImportRemainingQtyByDates is called', () => {
    const body = {
      issueAvailableStartDate: '2013-12-01',
      issueAvailableEndDate: '2013-12-01',
      expiryDate: '2013-12-01',
      trustAccountEndDateQuery: '2013-12-01',
    }
    service.getImportRemainingQtyByDates(1, body, true);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getImportRemainingQtyByDates is called', () => {
    const body = {
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      expiryDate: '',
    }
    service.getImportRemainingQtyByDates(1, body);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getSaftyStockQty is called', () => {
    service.getSaftyStockQty(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getSkuIdsBySourceOrSkuCodeOrName is called', () => {
    service.getSkuIdsBySourceOrSkuCodeOrName(SkuDetailSourceTypeEnum.EDENRED, '1', 'name', 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getSkuIdsBySourceOrSkuCodeOrName is called', () => {
    service.getSkuIdsBySourceOrSkuCodeOrName(SkuDetailSourceTypeEnum.IMPORT, '1', 'name', 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getSkuIdsBySourceOrSkuCodeOrName is called', () => {
    service.getSkuIdsBySourceOrSkuCodeOrName(SkuDetailSourceTypeEnum.TPC, '1', 'name', 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getSkuIdsByProductCode is called', () => {
    service.getSkuIdsByProductCode('productCode');
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getWatermarks is called', () => {
    service.getWatermarks(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getBatchIdByReservationCode is called', () => {
    service.getBatchIdByReservationCode('reservationCode');
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getSkuIdByMercahntName is called', () => {
    service.getSkuIdByMercahntName('merchantName', SkuDetailSourceTypeEnum.EDENRED, 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getSkuIdByMercahntName is called', () => {
    service.getSkuIdByMercahntName('merchantName', SkuDetailSourceTypeEnum.IMPORT, 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getSkuIdByMercahntName is called', () => {
    service.getSkuIdByMercahntName('merchantName', SkuDetailSourceTypeEnum.TPC, 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getSkuIdByMercahntName is called', () => {
    service.getSkuIdByMercahntName('merchantName', SkuDetailSourceTypeEnum.ALL, 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getInventoryListBySearchConditions is called', () => {
    const conditions:getInventoryListRequestInterface = {
      batchNo: '1',
      isCritical: false,
      startExpiryDate: '',
      endExpiryDate: '',
      startTrustAccountEndDate: '',
      endTrustAccountEndDate: '',
      startCreatedDate: '',
      endCreatedDate: '',
    }
    service.getInventoryListBySearchConditions(conditions, [1], 1, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getInventoryListBySearchConditions is called', () => {
    const conditions:getInventoryListRequestInterface = {
      batchNo: '',
      isCritical: true,
      startExpiryDate: '2019-12-31',
      endExpiryDate: '2019-12-31',
      startTrustAccountEndDate: '2019-12-31',
      endTrustAccountEndDate: '2019-12-31',
      startCreatedDate: '2019-12-31',
      endCreatedDate: '2019-12-31',
    }
    service.getInventoryListBySearchConditions(conditions, [1], 0, 0);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getInventoryDetailsBySkuId is called', () => {
    service.getInventoryDetailsBySkuId(1);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })

  it('should call graphqlApiService.postQuery when getBatchInventoryDetails is called', () => {
    const body = {
      expiryDate: '',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      trustAccountEndDate: '',
    };
    service.getBatchInventoryDetails(1, body, SkuDetailSourceTypeEnum.EDENRED);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getBatchInventoryDetails is called', () => {
    const body = {
      expiryDate: '',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      trustAccountEndDate: '',
    };
    service.getBatchInventoryDetails(1, body, SkuDetailSourceTypeEnum.IMPORT);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getBatchInventoryDetails is called', () => {
    const body = {
      expiryDate: '2019-12-31',
      issueAvailableStartDate: '2019-12-31',
      issueAvailableEndDate: '2019-12-31',
      trustAccountEndDate: '2019-12-31',
    };
    service.getBatchInventoryDetails(1, body, SkuDetailSourceTypeEnum.IMPORT);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })
  it('should call graphqlApiService.postQuery when getBatchInventoryDetails is called', () => {
    const body = {
      expiryDate: '',
      issueAvailableStartDate: '',
      issueAvailableEndDate: '',
      trustAccountEndDate: '',
    };
    service.getBatchInventoryDetails(1, body, SkuDetailSourceTypeEnum.TPC);
    expect(service.graphqlApiService.postQuery).toHaveBeenCalled();
  })





});