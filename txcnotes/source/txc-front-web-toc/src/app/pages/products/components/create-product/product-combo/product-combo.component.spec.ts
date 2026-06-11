import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboComponent } from './product-combo.component';

describe('ProductComboComponent', () => {
  let component: ProductComboComponent;
  let fixture: ComponentFixture<ProductComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
