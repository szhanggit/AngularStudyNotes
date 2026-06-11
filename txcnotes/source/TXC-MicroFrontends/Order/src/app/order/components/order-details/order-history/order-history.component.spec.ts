import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { OrderHistoryComponent } from './order-history.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StringSplitByCapitalLetterPipe } from 'src/app/order/pipes/string-split-by-capital-letter.pipe';
import { DatePipe } from '@angular/common';
import { OrderHistoryService } from 'src/app/order/services/order-history.service';
import { of, throwError } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;
  const orderHisorySvcSpy = jasmine.createSpyObj('OrderHistoryService', [
    'getOrderActionHistories',
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);

  const mockOrderHistory = [
    {
      result: 'Under Review',
      operator: 'user',
      createdDateTime: '2023-12-12',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderHistoryComponent, NgbdToastGlobal],
      imports: [HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        StringSplitByCapitalLetterPipe,
        DatePipe,
        {
          provide: OrderHistoryService,
          useValue: orderHisorySvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    orderHisorySvcSpy.getOrderActionHistories.and.returnValue(
      of(mockOrderHistory)
    );
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchOrderHistoryData()', () => {
    beforeEach(() => {
      // arrange
      component.orderId = 1;
    });
    it('should call getOrderActionHistories and return success', fakeAsync(() => {
      // arrange
      const assignDataToTableRows = spyOn(component, 'assignDataToTableRows');

      // act
      component.ngOnInit();
      component.fetchOrderHistoryData();
      tick();

      // assert
      expect(orderHisorySvcSpy.getOrderActionHistories).toHaveBeenCalled();
      expect(assignDataToTableRows).toHaveBeenCalled();
    }));

    it('should call getOrderActionHistories and return error', fakeAsync(() => {
      // arrange
      orderHisorySvcSpy.getOrderActionHistories.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.fetchOrderHistoryData();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
