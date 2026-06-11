import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';

import { MerchantListComponent } from './merchant-list.component';

describe('MerchantListComponent', () => {
  // initiate component and fixture
  let component: MerchantListComponent;
  let fixture: ComponentFixture<MerchantListComponent>;

  // initiate tenantConfig service and merchant service mock and stub
  let mockTenantConfigService;
  let mockMerchantService: jasmine.SpyObj<MerchantService>;
  let stubMerchantService: any;

  // mock data for merchant detail
  const mockMerchant = {
    "merchantId": 0,
    "merchantAcquirerId": 0,
    "needConsumerScan": false,
    "memo": "",
    "programId": 0,
    "programCode": 0,
    "workKeyId": 0,
    "workKey": null,
    "workKeyExpireTime": "0001-01-01T00:00:00",
    "workKeyCreatedTime": "0001-01-01T00:00:00",
    "isLegacyMerchant": false,
    "merchantName": "string",
    "externalCode": "string",
    "identityCode": "1234567",
    "invoiceRegisterNumber": "1234567",
    "securityKey": "string",
    "status": 0,
    "tX1MerchantUID": "string",
    "isAutoCreateReimbursement": true,
    "autoCreateReimbursementIntervalType": 0,
    "reimbursementTaxType": 0,
    "reimbursementReceivers": "string",
    "sameKeyWithShop": true,
    "mamEmail": "string@te",
    "reimbursementType": 0,
    "merchantAutoType": 0,
    "notificationMerchantCode": "string",
    "merchantEmail": "string",
    "issuerType": 0,
    "mainContact": "string",
    "mainPhone": "1234567890",
    "autoCreateReimbursementDay": 0,
    "description": "string",
    "categoryId": 0,
    "merchantContactEmailList": [
      "string@te"
    ],
    "edenredContactEmailList": [
      "string@te"
    ],
    "merchantAddress": "string@te",
    "address": {}
  };

  beforeEach(async () => {
    // setup tenantConfig service returnValue
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'name'
    });

    // setup merchant service spied method and stub partial implementations
    mockMerchantService = jasmine.createSpyObj(['updateMerchant'], ['merchants$', 'loading$', 'page', 'total$']);
    stubMerchantService = {
      updateMerchant: () => of({data: {}, success: true, message: ""}),
      total$: of(100),
      page: 1,
      pageSize: 20
    }

    // mock merchant module and add declarations and provide service needed in unit testing
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MerchantListComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: MerchantService,
          useValue: stubMerchantService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('page attributes', () => {
    it('should return itemStart and itemEnd showing on pagination params: page - 1, pageSize 10', fakeAsync(() => {
      component.merchantService.page = 1;
      component.merchantService.pageSize = 10;

      tick(100);
      expect(component.itemStart).toBe(1);
      expect(component.itemEnd).toBe(10);
    }));


    it('should return itemStart and itemEnd showing on pagination params: page - 2, pageSize 10', fakeAsync(() => {
      component.merchantService.page = 2;
      component.merchantService.pageSize = 10;

      tick(100);
      expect(component.itemStart).toBe(11);
      expect(component.itemEnd).toBe(20);
    }));
  });

  describe('setMerchantStatus', () => {
    it('should call updateMerchant', fakeAsync(() => {
      component.merchantService = mockMerchantService;
      mockMerchantService.updateMerchant.and.returnValue(of({
        data: {},
        message: '',
        success: true
      }));
      component.setMerchantStatus(mockMerchant);
      tick(100);

      expect(mockMerchantService.updateMerchant).toHaveBeenCalled();
    }));
  });
});
