import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboBatchUpdateComponent } from './product-combo-batch-update.component';

describe('ProductComboBatchUpdateComponent', () => {
  let component: ProductComboBatchUpdateComponent;
  let fixture: ComponentFixture<ProductComboBatchUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboBatchUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComboBatchUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
