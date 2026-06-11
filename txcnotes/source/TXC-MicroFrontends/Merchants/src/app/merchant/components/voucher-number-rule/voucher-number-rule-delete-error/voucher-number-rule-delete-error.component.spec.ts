import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherNumberRuleDeleteErrorComponent } from './voucher-number-rule-delete-error.component';

describe('VoucherNumberRuleDeleteErrorComponent', () => {
  let component: VoucherNumberRuleDeleteErrorComponent;
  let fixture: ComponentFixture<VoucherNumberRuleDeleteErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherNumberRuleDeleteErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleDeleteErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
