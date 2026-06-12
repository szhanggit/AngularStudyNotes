import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';

import { VoucherNumberRuleListComponent } from './voucher-number-rule-list.component';

xdescribe('VoucherNumberRuleListComponent', () => {
  // initiate the component and fixture
  let component: VoucherNumberRuleListComponent;
  let fixture: ComponentFixture<VoucherNumberRuleListComponent>;

  // declare a mock service for vnr service
  let mockVoucherNumberRuleService: jasmine.SpyObj<VoucherNumberRuleService>;

  beforeEach(async () => {
    // setup vnr service to return values
    mockVoucherNumberRuleService = jasmine.createSpyObj(['createVoucherNumberRule']);
    mockVoucherNumberRuleService.createVoucherNumberRule.and.returnValue(of({
      data: {
        merchantID: 999,
        voucherNumberRule: [],
        totalCount: 0,
      },
      message: '',
      success: true
    }));

    // mock merchant module
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [VoucherNumberRuleListComponent],
      imports: [
        HttpClientTestingModule,
        NgbCollapseModule
      ],
      providers: [
        {
          provide: VoucherNumberRuleService,
          useValue: mockVoucherNumberRuleService
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleListComponent);
    component = fixture.componentInstance;

    // set id to 999
    component.merchantId = 999;

    fixture.detectChanges();
  });

  describe('collapse', () => {
    it('vnrListCollapse toggle method should be called', () => {
      component.vnrListCollapse = {
        toggle: jasmine.createSpy()
      } as unknown as any;

      component.collapse();

      expect(component.vnrListCollapse.toggle).toHaveBeenCalled();
    });
  });
});
