import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherNumberRuleTableComponent } from './voucher-number-rule-table.component';

describe('VoucherNumberRuleTableComponent', () => {
  let component: VoucherNumberRuleTableComponent;
  let fixture: ComponentFixture<VoucherNumberRuleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherNumberRuleTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherNumberRuleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
