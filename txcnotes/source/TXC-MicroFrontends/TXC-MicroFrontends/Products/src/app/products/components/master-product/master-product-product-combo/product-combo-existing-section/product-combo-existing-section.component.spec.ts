import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboExistingSectionComponent } from './product-combo-existing-section.component';

describe('ProductComboExistingSectionComponent', () => {
  let component: ProductComboExistingSectionComponent;
  let fixture: ComponentFixture<ProductComboExistingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboExistingSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComboExistingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
