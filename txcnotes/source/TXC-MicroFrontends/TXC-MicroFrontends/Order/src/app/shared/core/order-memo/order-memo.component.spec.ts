import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMemoComponent } from './order-memo.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderMemoComponent', () => {
  let component: OrderMemoComponent;
  let fixture: ComponentFixture<OrderMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderMemoComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
