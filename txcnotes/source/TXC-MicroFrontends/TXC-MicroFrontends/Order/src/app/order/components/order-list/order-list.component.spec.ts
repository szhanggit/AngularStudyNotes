import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from './order-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { of } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { ExportDeliveryComponent } from '../export-delivery/export-delivery.component';

describe('OrderListComponent', () => {
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const orderSvcSpy = jasmine.createSpyObj('OrderService', [], {
    orders$: of([
      {
        createdOn: '',
      },
    ]),
    currentTab: 1,
    createdFrom: new Date(),
    createdTo: new Date(),
  });
  const authLibrarySpy = jasmine.createSpyObj('AuthorizationLibraryService', [
    'getElementOperationFlag',
  ]);
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      imports: [HttpClientTestingModule, NgbNavModule],
      providers: [
        {
          provide: AuthorizationLibraryService,
          useValue: authLibrarySpy,
        },
        {
          provide: OrderService,
          useValue: orderSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onNavChange', () => {
    it('should change order service current tab to 1 when nav active id is 1', () => {
      // act
      component.onNavChange({ activeId: '1' } as any);

      // assert
      expect(orderSvcSpy.currentTab).toBe(1);
    });

    it('should change order service current tab to 1 when nav active id is not 1', () => {
      // act
      component.onNavChange({ activeId: '2' } as any);

      // assert
      expect(orderSvcSpy.currentTab).toBe(1);
    });
  });

  describe('getOrderStatus', () => {
    beforeEach(() => {
      // arrange
      component.orderStatusData = ORDER_CONSTANTS.ORDER_STATUS_DATA;
    });

    it('should return status label', () => {
      // arrange
      const expectedLabel = 'All';

      // act
      const result = component.getOrderStatus(0);

      // assert
      expect(result).toBe(expectedLabel);
    });

    it('should return itself when not found', () => {
      // arrange
      const expectedLabel = '3';

      // act
      const result = component.getOrderStatus(3);

      // assert
      expect(result).toBe(expectedLabel);
    });
  });

  describe('getCssClassForOrder', () => {
    it('should return under review when value is 1', () => {
      // arrange
      const expectedCssClass = 'under-review';

      // act
      const result = component.getCssClassForOrder(1);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return rejected when value is 4', () => {
      // arrange
      const expectedCssClass = 'rejected';

      // act
      const result = component.getCssClassForOrder(4);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return approved when value is 8', () => {
      // arrange
      const expectedCssClass = 'approved';

      // act
      const result = component.getCssClassForOrder(8);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return approved ft when value is 16', () => {
      // arrange
      const expectedCssClass = 'approved-ft';

      // act
      const result = component.getCssClassForOrder(16);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return published when value is 64', () => {
      // arrange
      const expectedCssClass = 'published';

      // act
      const result = component.getCssClassForOrder(64);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return failed when value is 512', () => {
      // arrange
      const expectedCssClass = 'failed';

      // act
      const result = component.getCssClassForOrder(512);

      // assert
      expect(result).toBe(expectedCssClass);
    });

    it('should return empty when value is invalid', () => {
      // arrange
      const expectedCssClass = '';

      // act
      const result = component.getCssClassForOrder(23);

      // assert
      expect(result).toBe(expectedCssClass);
    });
  });

  it('onExport should open export delivery modal', () => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve(),
      componentInstance: { selectedQuotation: {} },
    });

    // act
    component.onExport({} as any, 1);

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(ExportDeliveryComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  });

  it('datePickerValues and set dateTo and dateFrom to value passed if value is valid', () => {
    // arrange
    const toDate = '08/08/2022';
    const fromDate = '08/10/2023';

    // act
    component.datePickerValues({ toDate, fromDate });

    // assert
    expect(orderSvcSpy.createdFrom).toBeDefined();
    expect(orderSvcSpy.createdTo).toBeDefined();
  });

  it('handleDatePickerValuesDelete and set dateTo and dateFrom to value passed if value is valid', () => {
    // act
    component.handleDatePickerValuesDelete();

    // assert
    expect(orderSvcSpy.createdFrom).toBeDefined();
    expect(orderSvcSpy.createdTo).toBeDefined();
  });
});
