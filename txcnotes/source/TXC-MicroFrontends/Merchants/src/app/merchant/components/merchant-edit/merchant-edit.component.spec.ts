import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';

import { MerchantEditComponent } from './merchant-edit.component';

describe('MerchantEditComponent', () => {
  // initiate component and fixture
  let component: MerchantEditComponent;
  let fixture: ComponentFixture<MerchantEditComponent>;

  // declare mock for tenantConfig and merchant service
  let mockTenantConfigService;
  let mockMerchantService: jasmine.SpyObj<MerchantService>;

  // mock data for merchant details response
  const mockResponse = {
    "data": {
      "merchantDetails": [
        {
          "merchantId": 570,
          "programId": 307,
          "programCode": "00001",
          "programName": "TX2.0",
          "identityCode": "000000000006058",
          "merchantName": "Marvin Merchant",
          "externalCode": "123456",
          "invoiceRegisterNumber": "123456",
          "securityKey": "4D7BC09B61E60F088F0905EF3AAF3F55",
          "status": 0,
          "tX1MerchantUID": "",
          "isAutoCreateReimbursement": false,
          "autoCreateReimbursementIntervalType": 0,
          "reimbursementTaxType": 0,
          "reimbursementType": 0,
          "reimbursementReceivers": "",
          "sameKeyWithShop": false,
          "mamEmail": "123@te",
          "merchantAutoType": 0,
          "notificationMerchantCode": "",
          "merchantEmail": "",
          "merchantAcquireId": 0,
          "merchantAcquireName": null,
          "needConsumerScan": false,
          "memo": "",
          "issuerType": 0,
          "workKeyId": 0,
          "workKey": null,
          "workKeyExpireTime": "0001-01-01T00:00:00",
          "workKeyCreatedTime": "0001-01-01T00:00:00",
          "isLegacyMerchant": false,
          "mainContact": "",
          "mainPhone": "",
          "autoCreateReimbursementDay": 0,
          "description": "",
          "categoryId": 0,
          "address": {
            "id": 384740,
            "detailAddressLine": "",
            "district": "",
            "cityId": 0,
            "stateOrProvinceId": 0,
            "postcode": "",
            "countryId": 0,
            "longitude": 0,
            "latitude": 0,
            "status": 0
          },
          "merchantContactEmailList": [
            "123@te"
          ],
          "edenredContactEmailList": [
            "123@te"
          ]
        }
      ],
      "totalCount": 1
    },
    "message": "Success",
    "success": true
  };

  beforeEach(async () => {
    // setup tenantConfig to return values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'GL'
    });

    // setup merchantService to return values
    mockMerchantService = jasmine.createSpyObj(['getMerchantById']);
    mockMerchantService.getMerchantById.and.returnValue(of(mockResponse as unknown as any));

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MerchantEditComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: MerchantService,
          useValue: mockMerchantService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and call getMerchantById', fakeAsync(() => {
    tick(100);

    expect(mockMerchantService.getMerchantById).toHaveBeenCalled();
    expect(component).toBeTruthy();
  }));
});
