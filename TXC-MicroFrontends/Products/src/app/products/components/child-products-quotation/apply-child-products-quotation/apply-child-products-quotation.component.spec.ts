import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyChildProductsQuotationComponent } from './apply-child-products-quotation.component';

describe('ApplyChildProductsQuotationComponent', () => {
  let component: ApplyChildProductsQuotationComponent;
  let fixture: ComponentFixture<ApplyChildProductsQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyChildProductsQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyChildProductsQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
