import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ROUTES, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TaiwanMerchantFormGroup } from '../../models/merchant-form-group.model';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';

import { MerchantFormComponent } from './merchant-form.component';

describe('MerchantFormComponent', () => {
  // initiate component and fixture
  let component: MerchantFormComponent;
  let fixture: ComponentFixture<MerchantFormComponent>;

  // setup mock service for form builder and router 
  const mockFormBuilder: FormBuilder = new FormBuilder();
  let mockRouter: Router;
  const routes: Routes = [
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full'
    },
    {
      path: 'details',
      redirectTo: '',
      pathMatch: 'full'
    }
  ];

  // declare mock values for merchant list response and create/update response
  const mockMerchantListResponse = { data: { merchantDetails: [{ merchantId: 0, merchantName: 'sample' }] } };
  const mockResponse = {
    data: {},
    message: 'success',
    success: true
  };

  // mock service for tenantConfig and merchantService
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  let mockMerchantService: jasmine.SpyObj<MerchantService>;

  // create a spy on tooltip
  let tooltip: jasmine.SpyObj<NgbTooltip>

  beforeEach(async () => {
    // setup mock return values 
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });
    
    // setup mock merchant service and its return values
    mockMerchantService = jasmine.createSpyObj(['createMerchant', 'updateMerchant']);
    mockMerchantService.createMerchant.and.returnValue(of(mockResponse));
    mockMerchantService.updateMerchant.and.returnValue(of(mockResponse));

    // create a mock merchant module with comps and provide service needed to test merchant form
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MerchantFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        NgbTooltipModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: FormBuilder,
          useValue: mockFormBuilder
        },
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

      // inject router and get the reference to spy on it when called
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(MerchantFormComponent);
    component = fixture.componentInstance;

    // set current selected tenant and get Taiwan Form Group
    component.tenant = 'TW';
    component.merchantFormGroup = (new TaiwanMerchantFormGroup).define(mockFormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('merchant form', () => {
    it('should create merchant email when addMerchantEmail is called', () => {
      component.addMerchantEmail();

      expect(component.f.merchantContactEmailList.length).toBe(2);
    });

    describe('when remove merchant email is called', () => {
      it('should remove merchant email when the length is greater than 1', () => {
        // add 1 merch email
        component.addMerchantEmail();
        component.removeMerchantEmail(1);

        expect(component.f.merchantContactEmailList.length).toBe(1);
      });

      it('should not remove merchant email when the length is less than or equal to 1', () => {
        component.removeMerchantEmail(1);

        expect(component.f.merchantContactEmailList.length).toBe(1);
      });
    });

    it('should create internal email when addInternalEmail is called', () => {
      component.addInternalEmail();

      expect(component.f.edenredContactEmailList.length).toBe(2);
    });

    describe('when remove internal email is called', () => {
      it('should remove internal email when the length is greater than 1', () => {
        // add 1 internal email
        component.addInternalEmail();
        component.removeInternalEmail(1);

        expect(component.f.edenredContactEmailList.length).toBe(1);
      });

      it('should not remove internal email when the length is less than or equal to 1', () => {
        component.removeInternalEmail(1);

        expect(component.f.edenredContactEmailList.length).toBe(1);
      });
    });
  });

  describe('cancelAction is called', () => {
    it('should navigate to merchant list when on create mode', () => {
      component.isEdit = false;

      component.cancelAction();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['merchants/'],
        {
          queryParams: { tenantName: 'TW' }
        });
    });

    it('should navigate to merchant details when on edit mode', () => {
      component.isEdit = true;
      component.merchant = mockMerchantListResponse.data.merchantDetails[0] as unknown as Merchant;

      component.cancelAction();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['merchants/details'],
        {
          queryParams: {
            tenantName: 'TW',
            merchantId: component.merchant.merchantId
          }
        });
    });
  });

  describe('OnSubmit is called', () => {
    it('should call merchantService createMerchant when on create mode', fakeAsync(
      () => {
        component.isEdit = false;
        component.merchantFormGroup.setValue({
          "programId": 0,
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
            {
              emailAddress: "string@te"
            }
          ],
          "edenredContactEmailList": [
            {
              internalEmailAddress: "string@te"
            }
          ],
          "merchantAddress": "string@te"
        });

        component.OnSubmit();
        tick(100);

        expect(mockMerchantService.createMerchant).toHaveBeenCalled();
      }
    ));

    it('should call merchantService updateMerchant when on edit mode', fakeAsync(
      () => {
        component.isEdit = true;
        component.merchantFormGroup = (new TaiwanMerchantFormGroup).define(mockFormBuilder, true);
        component.merchant = mockMerchantListResponse.data.merchantDetails[0] as unknown as Merchant;
        component.merchantFormGroup.setValue({
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
            {
              emailAddress: "string@te"
            }
          ],
          "edenredContactEmailList": [
            {
              internalEmailAddress: "string@te"
            }
          ],
          "merchantAddress": "string@te"
        });
  
        component.OnSubmit();
        tick(100);

        expect(mockMerchantService.updateMerchant).toHaveBeenCalled();
      }
    ));
  });

  describe('toggleTooltipWithContext', () => {
    beforeEach(() => {
      tooltip = jasmine.createSpyObj(['isOpen', 'open', 'close']);
    })
    it('should show when hidden', () => {
      const fc: any = {};
      tooltip.isOpen.and.returnValue(false);

      component.toggleTooltipWithContext(tooltip, fc);

      expect(tooltip.open).toHaveBeenCalled();
    });

    it('should show when hidden', () => {
      const fc: any = {};
      tooltip.isOpen.and.returnValue(true);

      component.toggleTooltipWithContext(tooltip, fc);

      expect(tooltip.close).toHaveBeenCalled();
    });
  });
});
