import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReferenceDetailsComponent } from './order-reference-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuotationTypePipe } from '../../pipes/quotation-type.pipe';
import { TxcDateTimePipe } from '@txc-angular/component-library';

describe('OrderReferenceDetailsComponent', () => {
  let component: OrderReferenceDetailsComponent;
  let fixture: ComponentFixture<OrderReferenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrderReferenceDetailsComponent,
        QuotationTypePipe,
        TxcDateTimePipe,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderReferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
