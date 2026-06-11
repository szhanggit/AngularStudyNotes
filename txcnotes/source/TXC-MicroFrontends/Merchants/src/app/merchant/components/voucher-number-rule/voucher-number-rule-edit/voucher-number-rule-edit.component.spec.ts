import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherNumberRuleEditComponent } from './voucher-number-rule-edit.component';

describe('VoucherNumberRuleEditComponent', () => {
  let component: VoucherNumberRuleEditComponent;
  let fixture: ComponentFixture<VoucherNumberRuleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherNumberRuleEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
