import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupSkuManagementComponent } from './merchant-group-sku-management.component';
import { NgbdToastGlobal, TxcDateTimePipe } from 'component-library';
import { MerchantDetailsComponent } from '../../../merchant-details/merchant-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbCollapseModule, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ContractSchemeEnum } from 'src/app/merchant/enums/merchant-group.enum';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('MerchantGroupSkuManagementComponent', () => {
  let component: MerchantGroupSkuManagementComponent;
  let fixture: ComponentFixture<MerchantGroupSkuManagementComponent>;
  let mockTenantConfigService: jasmine.SpyObj<TenantConfigService>;
  let mockMerchantService: jasmine.SpyObj<MerchantService>;
  let activatedRoute: ActivatedRoute;
  mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
  mockTenantConfigService.getTenant.and.returnValue({
    id: 7,
    name: 'TW'
  });
  localStorage.setItem('tenant', `{"id":7,"isSelected":false,"name":"TW","currentUTCOffset":"+08:00","currencySymbol":"TW"}`);

  @Component({
    selector: 'ngbd-toast-global',
    template: ''
  })
  class MockToastComponent {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MerchantGroupSkuManagementComponent,
        MerchantDetailsComponent,
        TxcDateTimePipe,
        MockToastComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbCollapseModule,
        NgbTooltipModule,
        ReactiveFormsModule,
        DatePipe,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        FormBuilder,
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
        {
          provide: MerchantService,
          useValue: mockMerchantService
        },
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        },
      ],
    }).compileComponents();
    activatedRoute = TestBed.inject(ActivatedRoute);
    const queryData = '123'
    // spyOnProperty(activatedRoute, 'url', 'get').and.returnValue(['merchant-group', 'sku', 'edit']);
    const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get');
    spyRoute.and.returnValue(queryData);
    fixture = TestBed.createComponent(MerchantGroupSkuManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get skuTypeDroupdown when onInit is called', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.skuTypeDroupdown.length > 0).toBeTruthy();
  });

  fit('should get getVnrDropdownList when onInit is called', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getVnrDropdownList()).toHaveBeenCalled();
    // expect(component.vnrList.length > 0).toBeTruthy();
  });

  it('should set isEdit=true when onInit is called and url is contain edit', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isEdit).toBeTruthy();
  });





  xit('should disable the delete btn in table when start date has passed in edit mode with Fixed contract scheme', () => {
    const mockSkuGroupForm = {
      skuName: 'dummy sku name',
      skuNumber: 'dummy sku number',
      skuTypeId: 'dummy sku type id',
      faceValueWithTax: 'dummy face value with tax',
      multiplier: null,
      voucherNumberRuleId: null,
      contractScheme: ContractSchemeEnum.Fixed,
      contractSkuCosts: [{
        name: 'dummy name',
        skuCostId: 1235,
        merchantId: 222,
        shopAmount: 10,
        contractList: ['A', 'B', 'C', 'D', 'E', 'F'],
        contractId: 0,
        cost: null,
        validStartDate: new Date('2020-12-31'),
        validEndDate: new Date('2099-12-31'),
        isNewEdited: false,
      }]
    };
    component.skuGroupForm.patchValue(mockSkuGroupForm);
    fixture.detectChanges();
    const e = fixture.debugElement.query(By.css('.fixed__delete-btn'));
    expect(e.nativeElement.querySelector('.fixed__delete-btn').disabled).toBeTruthy;
  });

  xit('should disable the delete btn in table when start date has passed in edit mode with Percentage contract scheme', () => {
    const mockSkuGroupForm = {
      skuName: 'dummy sku name',
      skuNumber: 'dummy sku number',
      skuTypeId: 'dummy sku type id',
      faceValueWithTax: 'dummy face value with tax',
      multiplier: null,
      voucherNumberRuleId: null,
      contractScheme: ContractSchemeEnum.Percentage,
      contractSkuCosts: [{
        name: 'dummy name',
        skuCostId: 1235,
        merchantId: 222,
        shopAmount: 10,
        contractList: ['A', 'B', 'C', 'D', 'E', 'F'],
        contractId: 0,
        cost: null,
        validStartDate: new Date('2020-12-31'),
        validEndDate: new Date('2099-12-31'),
        isNewEdited: false,
      }]
    };
    component.skuGroupForm.patchValue(mockSkuGroupForm);
    fixture.detectChanges();
    const e = fixture.debugElement.query(By.css('.percentage__delete-btn'));
    expect(e.nativeElement.querySelector('.percentage__delete-btn').disabled).toBeTruthy;
  });

  it('should create when onContractSchemeChange has been called', () => {
  });



});
