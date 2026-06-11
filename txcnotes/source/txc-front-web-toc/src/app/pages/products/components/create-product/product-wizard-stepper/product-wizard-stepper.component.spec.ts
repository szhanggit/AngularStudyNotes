import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWizardStepperComponent } from './product-wizard-stepper.component';

describe('ProductWizardStepperComponent', () => {
  let component: ProductWizardStepperComponent;
  let fixture: ComponentFixture<ProductWizardStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWizardStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWizardStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
