import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoucherWatermarkRuleComponent } from './edit-voucher-watermark-rule.component';

describe('EditVoucherWatermarkRuleComponent', () => {
  let component: EditVoucherWatermarkRuleComponent;
  let fixture: ComponentFixture<EditVoucherWatermarkRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVoucherWatermarkRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVoucherWatermarkRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
