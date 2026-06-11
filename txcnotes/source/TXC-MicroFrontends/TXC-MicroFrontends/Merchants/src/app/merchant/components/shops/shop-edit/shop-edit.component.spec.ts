import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ShopService } from 'src/app/merchant/services/shop.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';

import { ShopEditComponent } from './shop-edit.component';

describe('ShopEditComponent', () => {
  // initiate component and fixture
  let component: ShopEditComponent;
  let fixture: ComponentFixture<ShopEditComponent>;

  // declate tenantConfig and shop mock service
  let mockTenantConfigService;
  let mockShopService: jasmine.SpyObj<ShopService>;

  // mock respon for get shop
  const mockResponse = {
    data: {
      shopId: 1,
      status: false,
      name: 'Shop',
      identityCode: '100',
      externalCode: '200',
      shopAddress: 'Details Address',
      contactPhone: '0922',
      securityKey: '000'
    },
    message: 'success',
    success: true
  }

  beforeEach(async () => {
    // setup return value of tenantConfig
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // setup return value of shop service
    mockShopService = jasmine.createSpyObj(['getShop']);
    mockShopService.getShop.and.returnValue(of(mockResponse));

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ ShopEditComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getShop on component creation', fakeAsync(() => {
    tick(100);
    
    expect(mockShopService.getShop).toHaveBeenCalled();
  }));
});
