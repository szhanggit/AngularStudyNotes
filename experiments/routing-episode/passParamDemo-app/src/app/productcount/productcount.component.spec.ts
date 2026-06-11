import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcountComponent } from './productcount.component';

describe('ProductcountComponent', () => {
  let component: ProductcountComponent;
  let fixture: ComponentFixture<ProductcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductcountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
