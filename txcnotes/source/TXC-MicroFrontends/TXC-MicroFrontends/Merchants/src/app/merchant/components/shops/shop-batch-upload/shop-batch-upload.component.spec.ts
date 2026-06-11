import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ShopService } from 'src/app/merchant/services/shop.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';

import { ShopBatchUploadComponent } from './shop-batch-upload.component';

describe('ShopBatchUploadComponent', () => {
  // initiate component and fixture
  let component: ShopBatchUploadComponent;
  let fixture: ComponentFixture<ShopBatchUploadComponent>;

  // mock service for tenantConfig, shop and router and mock component for tooltip
  let mockTenantConfigService;
  let mockShopService: jasmine.SpyObj<ShopService>;
  let mockTooltip: jasmine.SpyObj<NgbTooltip>;
  let mockRouter: Router;
  const routes: Routes= [
    {
      path: 'merchants/details',
      redirectTo: 'none'
    }
  ];

  beforeEach(async () => {
    // setup return value for tenantConfig
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // setup return value for shop service
    mockShopService = jasmine.createSpyObj(['createShop']);
    mockShopService.createShop.and.returnValue(of({
      data: {},
      message: "success",
      success: true
    }));

    // mock merchant module, declare component and provide needed service for testing
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ ShopBatchUploadComponent ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: ShopService,
          useValue: mockShopService
        }
      ]
    })
    .compileComponents();

    // inject and get the reference of the router to spy on it
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopBatchUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleTooltipWithContext', () => {
    beforeEach(() => {
      mockTooltip = jasmine.createSpyObj(['isOpen', 'open', 'close']);
    })
    it('should show when hidden', () => {
      const fc: any = {};
      mockTooltip.isOpen.and.returnValue(false);

      component.toggleTooltipWithContext(mockTooltip, fc);

      expect(mockTooltip.open).toHaveBeenCalled();
    });

    it('should show when hidden', () => {
      const fc: any = {};
      mockTooltip.isOpen.and.returnValue(true);

      component.toggleTooltipWithContext(mockTooltip, fc);

      expect(mockTooltip.close).toHaveBeenCalled();
    });
  });

  describe('toggleCollapsibleTable', () => {
    it('should toggle false if initial value is true', () => {
      component.show10 = true;

      component.toggleCollapsibleTable();

      expect(component.show10).toBeFalse();
    });

    it('should toggle true if initial value is false', () => {
      component.show10 = false;

      component.toggleCollapsibleTable();

      expect(component.show10).toBeTrue();
    });
  });

  describe('batchUpload', () => {
    it('should call shopService create', () => {
      component.merchantId = 1;
      component.sameExternalCode = true;

      component.shops = [{
        name: 'sampleShop',
        identityCode: '123456'
      }];

      component.batchUpload();

      expect(mockShopService.createShop).toHaveBeenCalled();
    });
  });

  describe('removeFromShops', () => {
    it('should remove shop', () => {
      component.shops = [{
        identityCode: '123456'
      }, {
        name: 'sampleShop',
        identityCode: '123456'
      }];
  
      component.removeFromShops(1);
  
      expect(component.shops.length).toEqual(1);
    });
  });

  describe('uploadFile', () => {
    it('should parse files passed, put it on the shop array and check for errors', () => {
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockEvt = { target: { files: [mockFile] } };
      component.uploadFile(mockEvt as any);

      expect(component.shops.length).toBe(0);
      expect(component.errorList.length).toBe(0);
    });
  });

  describe('toggleExternalCodeCheckbox', () => {
    it('should add no extenal code error on errorlist when sameExternalCode flag is false', () => {
      component.sameExternalCode = false;
      component.shops = [{
        name: 'sampleShop',
        identityCode: '123456'
      }, {
        name: 'sampleShop',
        identityCode: '123456'
      }];

      component.toggleExternalCodeCheckbox();

      expect(component.errorList[0].reason).toBe('No external code');
    });

    it('should not add no extenal code error on errorlist when sameExternalCode flag is true', () => {
      component.sameExternalCode = true;
      component.shops = [{
        name: 'sampleShop',
        externalCode: '123456'
      }, {
        name: 'sampleShop',
        externalCode: '123456'
      }];

      component.toggleExternalCodeCheckbox();

      expect(component.errorList.length).toBe(0);
    });
  });
});
