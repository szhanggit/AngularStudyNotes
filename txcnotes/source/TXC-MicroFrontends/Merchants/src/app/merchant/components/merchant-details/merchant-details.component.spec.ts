import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { ShopListComponent } from '../shops/shop-list/shop-list.component';
import { VoucherNumberRuleListComponent } from '../voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component';

import { MerchantDetailsComponent } from './merchant-details.component';

export function mockPipe(name: string): Pipe {
  const metadata: Pipe = {
    name
  };

  return Pipe(metadata)(
    class MockPipe implements PipeTransform {
      transform() { }
    }
  );
}

describe('MerchantDetailsComponent', () => {
  // initiate component and fixure
  let component: MerchantDetailsComponent;
  let fixture: ComponentFixture<MerchantDetailsComponent>;

  // mock router to control routing
  let mockRouter: Router;
  const routes: Routes = [
    {
      path: 'edit',
      redirectTo: 'none'
    }
  ];

  // mock tenantConfig and merchantService to control returnValues
  let mockTenantConfigService;
  let mockMerchantService;
  const mockResponse = { data: { merchantDetails: [{ merchantId: 0, merchantName: 'sample' }] } };

  // mock global toast component
  let mockToastShowSuccess: jasmine.Spy;

  beforeEach(async () => {
    // setup return value for tenantConfigService
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // setup return value for merchant service
    mockMerchantService = jasmine.createSpyObj(['getMerchantById']);
    mockMerchantService.getMerchantById.and.returnValue(of(mockResponse));

    // mock module for merchant and declare, provide only needed for merchant-details comp testing
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        MerchantDetailsComponent,
        NgbdToastGlobal,
        ShopListComponent,
        VoucherNumberRuleListComponent,
        mockPipe('issuertype'),
        mockPipe('reimbursementtaxtype'),
        mockPipe('autocreatereimbursement'),
        mockPipe('autocreatereimbursementday'),
        mockPipe('reimbursementtype'),
        mockPipe('merchantautotype'),
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        NgbCollapseModule
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
    }).compileComponents();

    // inject router but spy on it so it wont call through real routing
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDetailsComponent);
    component = fixture.componentInstance;
    component.currentProgram = { id: 0, name: 'Test', isEdenred: true, displayName: 'Test' };
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('should show toast', () => {
    beforeEach(() => {
      component.merchant = mockResponse.data.merchantDetails[0] as unknown as Merchant;
      jasmine.clock().install();
      component.ngOnInit();
      mockToastShowSuccess = spyOn(component.toast, 'showSuccess');
    });
    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('after shopCreated', (() => {
      history.pushState({action: 'shopCreated' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    }))

    it('after shopUpdated', () => {
      history.pushState({action: 'shopUpdated' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    })

    it('after vnrCreated', () => {
      history.pushState({action: 'vnrCreated' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    })

    it('after vnrUpdated', () => {
      history.pushState({action: 'vnrUpdated' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    })

    it('after batchUpload', () => {
      history.pushState({action: 'batchUpload' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    })

    it('after merchant details update', () => {
      history.pushState({action: 'merchantUpdated' }, '');
      jasmine.clock().tick(500);

      expect(mockToastShowSuccess).toHaveBeenCalled();
    })
  })

  it('should call getMerchantId', fakeAsync(() => {
    tick(10);
    expect(component.merchant).toEqual(mockResponse.data.merchantDetails[0] as unknown as Merchant);
  }));

  it('should navigate to edit merchant page when navigateToUpdateMerchant is called', () => {
    component.navigateToUpdateMerchant();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['merchants/edit'],
      {
        queryParams: { tenantName: 'TW', merchantId: 0 },
        state: { merchant: mockResponse.data.merchantDetails[0] }
      });
  });

  it('should navigate back to merchant list page when backToList is called', () => {
    component.backToList();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/merchant-list');
  });
});
