import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TenantConfigService } from '../../services/tenant-config.service';

import { MerchantCreateComponent } from './merchant-create.component';

describe('MerchantCreateComponent', () => {
  // initiate component and fixture
  let component: MerchantCreateComponent;
  let fixture: ComponentFixture<MerchantCreateComponent>;

  let mockTenantConfigService;
  beforeEach(async () => {
    // mock tenant config service to control returnValue
    mockTenantConfigService = jasmine.createSpyObj(['getTenant']);
    mockTenantConfigService.getTenant.and.returnValue({
      id: 7,
      name: 'TW'
    });

    // create a testing module, will act like the merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ MerchantCreateComponent ],
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
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
