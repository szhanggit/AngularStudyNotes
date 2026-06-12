import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboSearchSectionComponent } from './product-combo-search-section.component';

describe('ProductComboSearchSectionComponent', () => {
  let component: ProductComboSearchSectionComponent;
  let fixture: ComponentFixture<ProductComboSearchSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboSearchSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComboSearchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
