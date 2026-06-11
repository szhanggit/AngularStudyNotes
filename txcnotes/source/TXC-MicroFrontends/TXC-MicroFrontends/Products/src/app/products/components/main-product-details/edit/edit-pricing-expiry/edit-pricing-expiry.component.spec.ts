import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPricingExpiryComponent } from './edit-pricing-expiry.component';

describe('EditPricingExpiryComponent', () => {
  let component: EditPricingExpiryComponent;
  let fixture: ComponentFixture<EditPricingExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPricingExpiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPricingExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
