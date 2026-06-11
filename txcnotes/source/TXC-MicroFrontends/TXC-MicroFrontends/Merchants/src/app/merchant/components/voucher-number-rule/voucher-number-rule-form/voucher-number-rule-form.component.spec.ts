import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { SecurityKeyService } from 'src/app/merchant/services/security-key.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';

import { VoucherNumberRuleFormComponent } from './voucher-number-rule-form.component';

describe('VoucherNumberRuleFormComponent', () => {
  // initiate component and fixture
  let component: VoucherNumberRuleFormComponent;
  let fixture: ComponentFixture<VoucherNumberRuleFormComponent>;

  // declare mock values for components and service needed to test the vnr form
  let mockTooltip: jasmine.SpyObj<NgbTooltip>;
  let mockTenantConfigService;
  let mockVoucherNumberRuleService: jasmine.SpyObj<VoucherNumberRuleService>;
  let mockSecurityService: jasmine.SpyObj<SecurityKeyService>;
  let mockRouter: Router;
  const mockFormBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    // setup tenantConfig to return values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // setup vnr service to return values
    mockVoucherNumberRuleService = jasmine.createSpyObj(['getVoucherNumberRuleAlgorithm', 'getVoucherNumberRuleBarCode',
      'getVoucherNumberRulePinCode', 'getVoucherNumberRuleVoucherGenerator', 'createVoucherNumberRule']);

    mockVoucherNumberRuleService.getVoucherNumberRuleAlgorithm.and.returnValue(of({ data: { algorithmDto: [] }, message: '', success: true }));
    mockVoucherNumberRuleService.getVoucherNumberRuleBarCode.and.returnValue(of({ data: { barCodeDto: [] }, message: '', success: true }));
    mockVoucherNumberRuleService.getVoucherNumberRulePinCode.and.returnValue(of({ data: { pinCodeDto: [] }, message: '', success: true }));
    mockVoucherNumberRuleService.getVoucherNumberRuleVoucherGenerator.and.returnValue(of({ data: { voucherGeneratorDto: [] }, message: '', success: true }));
    mockVoucherNumberRuleService.createVoucherNumberRule.and.returnValue(of({ data: [], message: '', success: true }));

    // setup security service to return values
    mockSecurityService = jasmine.createSpyObj(['generateSecurityKey']);
    mockSecurityService.generateSecurityKey.and.returnValue('0000');

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [VoucherNumberRuleFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgbTooltipModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        }, {
          provide: VoucherNumberRuleService,
          useValue: mockVoucherNumberRuleService
        }, {
          provide: SecurityKeyService,
          useValue: mockSecurityService
        },{
          provide: FormBuilder,
          useValue: mockFormBuilder
        },
      ]
    })
      .compileComponents();

      // inject and get the reference to spy on it
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(VoucherNumberRuleFormComponent);
    component = fixture.componentInstance;

    // initiate the voucherNumberRuleForm
    component.voucherNumberRuleForm = mockFormBuilder.group({
      voucherNumberPrefix: new FormControl({ value: '', disabled: false }),
      voucherNumberType: new FormControl({ value: 1, disabled: false }),
      voucherNumberLength: new FormControl({ value: '', disabled: false }),
      displayVoucherNumberUnderBarcode: new FormControl({ value: false, disabled: false }),
      barcodeTypeId: new FormControl({ value: 1, disabled: false }),
      algorithmId: new FormControl({ value: 1, disabled: false }),
      ruleName: new FormControl({ value: '', disabled: false }),
      voucherNumberGenerator: new FormControl({ value: 1, disabled: false }),
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

  describe('onSubmit', () => {
    it('should call create voucher number rule when on create mode', fakeAsync(() => {
      component.OnSubmit();
      tick(100);

      expect(mockVoucherNumberRuleService.createVoucherNumberRule).toHaveBeenCalled();
    }));
  });

  describe('generateExample', () => {
    it('should call generateSecurity Key', () => {
      component.f.voucherNumberLength.setValue(8);
      component.generateExample();

      expect(mockSecurityService.generateSecurityKey).toHaveBeenCalled();
    });
  });
});
