import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductPricingAndExpiryComponent } from './master-product-pricing-and-expiry.component';

describe('MasterProductPricingAndExpiryComponent', () => {
  let component: MasterProductPricingAndExpiryComponent;
  let fixture: ComponentFixture<MasterProductPricingAndExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductPricingAndExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductPricingAndExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
