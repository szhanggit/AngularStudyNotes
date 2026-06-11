import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopMerchantComponent } from './acceptance-loop-merchant.component';

describe('AcceptanceLoopMerchantComponent', () => {
  let component: AcceptanceLoopMerchantComponent;
  let fixture: ComponentFixture<AcceptanceLoopMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceLoopMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
