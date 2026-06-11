import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboRearrangeSectionComponent } from './product-combo-rearrange-section.component';

describe('ProductComboRearrangeSectionComponent', () => {
  let component: ProductComboRearrangeSectionComponent;
  let fixture: ComponentFixture<ProductComboRearrangeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboRearrangeSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComboRearrangeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
