import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ShopService } from 'src/app/merchant/services/shop.service';

import { ShopFormComponent } from './shop-form.component';

describe('ShopFormComponent', () => {
  // initate component and fixture
  let component: ShopFormComponent;
  let fixture: ComponentFixture<ShopFormComponent>;

  // declare formbuilder, tooltip, router and shop service mocks
  const mockFormBuilder: FormBuilder = new FormBuilder();
  let mockTooltip: jasmine.SpyObj<NgbTooltip>;
  let mockShopService: jasmine.SpyObj<ShopService>;
  let mockRouter: Router;

  // mock data for create shop and edit shop
  const mockResponse = {
    data: "",
    message: "",
    success: true
  };

  beforeEach(async () => {
    // setup create and update shop to return success
    mockShopService = jasmine.createSpyObj(['createShop', 'updateShop']);
    mockShopService.createShop.and.returnValue(of(mockResponse));
    mockShopService.updateShop.and.returnValue(of(mockResponse));

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ShopFormComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbTooltipModule
      ],
      providers: [
        {
          provide: FormBuilder,
          useValue: mockFormBuilder
        },
        {
          provide: ShopService,
          useValue: mockShopService
        }
      ]
    })
      .compileComponents();

      // inject router and get the reference to spy on it
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(ShopFormComponent);
    component = fixture.componentInstance;

    // declare form group controls
    component.shopFormGroup = mockFormBuilder.group({
      id: null,
      status: null,
      name: null,
      externalCode: null,
      identityCode: null,
      contactPhone: null,
      shopAddress: null,
      securityKey: null,
      sameExternalCode: null
    });

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
  
  describe('OnSubmit is clicked', () => {
    it('should call createShop when on create mode', () => {
      component.isEdit = false;

      component.OnSubmit();

      expect(mockShopService.createShop).toHaveBeenCalled();
    });

    it('should call updateShop when on update mode', () => {
      component.isEdit = true;

      component.OnSubmit();

      expect(mockShopService.updateShop).toHaveBeenCalled();
    });
  });
});
