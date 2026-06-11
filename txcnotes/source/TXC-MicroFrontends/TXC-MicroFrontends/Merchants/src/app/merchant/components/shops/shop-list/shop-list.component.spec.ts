import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Shop } from 'src/app/merchant/models/shop.model';
import { ShopService } from 'src/app/merchant/services/shop.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';

import { ShopListComponent } from './shop-list.component';

describe('ShopListComponent', () => {
  // initiate component and fixture
  let component: ShopListComponent;
  let fixture: ComponentFixture<ShopListComponent>;

  // declare mock for tenantConfig, router and shop service, and shop service stub
  let mockTenantConfigService;
  let stubShopService: any;
  let mockShopService: jasmine.SpyObj<ShopService>;
  let mockRouter: Router;

  // mock data for get shop
  const mockShop: Shop = {
    "shopId": 92332,
    "merchantId": 570,
    "addressId": 384741,
    "identityCode": "0000060061",
    "externalCode": "Shop01",
    "shopName": "New Shop",
    "shopStatus": 0,
    "securityKey": "9211317E71ACE362C0AD6DF0ECBE9A91",
    "contactName": "New Shop",
    "contactPhone": "",
    "address": {
      "id": 384741,
      "detailAddressLine": "",
      "cityId": 0,
      "stateOrProvinceId": 0,
      "countryId": 0,
      "longitude": 0,
      "latitude": 0,
      "status": 0
    }
  };
  const mockResponse = [mockShop];

  beforeEach(async () => {
    // setup tenantConfig to return values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // setup mock shop service to return value and stub shop to implement partial
    mockShopService = jasmine.createSpyObj(['updateShop', 'refresh'], ['shops$', 'loading$', 'page', 'total$']);
    stubShopService = {
      updateShop: () => of({ data: {}, success: true, message: "" }),
      shops$: of(mockResponse),
      total$: of(100),
      page: 1,
      pageSize: 20
    };

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ShopListComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbCollapseModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: ShopService,
          useValue: stubShopService
        }
      ]
    })
      .compileComponents();

      // inject and get the reference to spy on it
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('page attributes', () => {
    it('should return itemStart and itemEnd showing on pagination params: page - 1, pageSize 10', fakeAsync(() => {
      component.shopService.page = 1;
      component.shopService.pageSize = 10;

      tick(100);
      expect(component.itemStart).toBe(1);
      expect(component.itemEnd).toBe(10);
    }));


    it('should return itemStart and itemEnd showing on pagination params: page - 2, pageSize 10', fakeAsync(() => {
      component.shopService.page = 2;
      component.shopService.pageSize = 10;

      tick(100);
      expect(component.itemStart).toBe(11);
      expect(component.itemEnd).toBe(20);
    }));
  });

  describe('updateStatus', () => {
    it('should call updateShop and showSuccess toast when success flag is false', fakeAsync(() => {
      component.shopService = mockShopService;
      component.toast = {
        showSuccess: jasmine.createSpy()
      } as unknown as any;
      mockShopService.updateShop.and.returnValue(of({
        data: {},
        message: '',
        success: true
      }));

      component.updateStatus(mockShop);
      tick(100);

      expect(mockShopService.updateShop).toHaveBeenCalled();
      expect(component.toast.showSuccess).toHaveBeenCalled();
    }));

    it('should call updateShop and showDanger toast when success flag is false', fakeAsync(() => {
      component.shopService = mockShopService;
      component.toast = {
        showDanger: jasmine.createSpy()
      } as unknown as any;
      mockShopService.updateShop.and.returnValue(of({
        data: {},
        message: '',
        success: false
      }));

      component.updateStatus(mockShop);
      tick(100);

      expect(mockShopService.updateShop).toHaveBeenCalled();
      expect(component.toast.showDanger).toHaveBeenCalled();
    }));
  });

  describe('collapse', () => {
    it('should call shopservice merchant if shopList is not collaped', () => {
      component.shopService = mockShopService;
      component.shopListCollapsed = false;
      component.merchant = { merchantID: 999 } as unknown as any;

      component.collapse();

      expect(mockShopService.refresh).toHaveBeenCalled();
    });
  });

  describe('downloadTemplate', () => {
    it('should stop propagation of passed event', () => {
      const event = new Event('clickEvent');
      event.stopPropagation = jasmine.createSpy();

      component.downloadTemplate();

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('exportShops', () => {
    it('should call exportAsExcelFile', () => {
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockEvt = { target: { files: [mockFile] } };

      component.shopsExport = mockResponse;
      component.merchant = { merchantID: 999 } as unknown as any;
      component.exportAsExcelFile = jasmine.createSpy();

      component.exportShops();
      component.uploadFile(mockEvt as any);

      expect(component.exportAsExcelFile).toHaveBeenCalled();
    });
  })

  describe('toExportFileName', () => {
    it('should return file name', () => {
      const result = component.toExportFileName('sample');

      expect(result).toContain('sample');
    });
  });

  describe('navigation', () => {
    const mockMerchant = { merchantId: 999 };
    it('should redirect to shop create when navigateToCreateShop is called', () => {
      component.merchant = mockMerchant as unknown as any;
      component.navigateToCreateShop();

      expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['merchants/shop/create'],
        {
          queryParams: {
            merchantId: mockMerchant.merchantId
          }
        });;
    });

    it('should redirect to shop edit when navigateToEditShop is called', () => {
      component.merchant = mockMerchant as unknown as any;
      component.navigateToEditShop(1);

      expect(mockRouter.navigate).toHaveBeenCalledOnceWith([`merchants/shop/edit/${1}`],
        {
          queryParams: {
            merchantId: mockMerchant.merchantId
          }
        });;
    });

  });

  describe('uploadFile', () => {
    it('should throw error when there is a lot of file selected', () => {
      try {
        const mockFile = new File([''], 'filename', { type: 'text/html' });
        const mockEvt = { target: { files: [mockFile, mockFile] } };

        component.uploadFile(mockEvt as any);
      } catch (err) {
        expect(err).toEqual(new Error("Cannot use multiple files"));
      }
    });
  });
});
