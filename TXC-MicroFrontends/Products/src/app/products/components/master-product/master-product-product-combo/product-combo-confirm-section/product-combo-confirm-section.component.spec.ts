import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboConfirmSectionComponent } from './product-combo-confirm-section.component';

describe('ProductComboConfirmSectionComponent', () => {
  let component: ProductComboConfirmSectionComponent;
  let fixture: ComponentFixture<ProductComboConfirmSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboConfirmSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComboConfirmSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
