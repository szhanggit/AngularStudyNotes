import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherNumberRuleDeleteComponent } from './voucher-number-rule-delete.component';

describe('VoucherNumberRuleDeleteComponent', () => {
  let component: VoucherNumberRuleDeleteComponent;
  let fixture: ComponentFixture<VoucherNumberRuleDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherNumberRuleDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
