import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyVoucherNumberRuleFormComponent } from './third-party-voucher-number-rule-form.component';

describe('ThirdPartyVoucherNumberRuleFormComponent', () => {
  let component: ThirdPartyVoucherNumberRuleFormComponent;
  let fixture: ComponentFixture<ThirdPartyVoucherNumberRuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPartyVoucherNumberRuleFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdPartyVoucherNumberRuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
