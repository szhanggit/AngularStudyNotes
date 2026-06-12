import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';

import { VoucherNumberRuleCreateComponent } from './voucher-number-rule-create.component';

describe('VoucherNumberRuleCreateComponent', () => {
  // initiate voucher number rule
  let component: VoucherNumberRuleCreateComponent;
  let fixture: ComponentFixture<VoucherNumberRuleCreateComponent>;

  // declare tenantConfig 
  let mockTenantConfigService;
  beforeEach(async () => {
    // setup tenantConfig to return values
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ VoucherNumberRuleCreateComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
