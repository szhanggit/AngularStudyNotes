import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDeliveryComponent } from './export-delivery.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Select2Module } from 'ng-select2-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order.service';
import { of } from 'rxjs';

describe('ExportDeliveryComponent', () => {
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['dismissAll']);
  const orderSvcSpy = jasmine.createSpyObj('OrderService', ['exportOrder'], {
    isClearDatePicker: true,
  });
  let component: ExportDeliveryComponent;
  let fixture: ComponentFixture<ExportDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportDeliveryComponent],
      imports: [HttpClientTestingModule, Select2Module, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        { provide: OrderService, useValue: orderSvcSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create', () => {
    it('when tab is 1', () => {
      // arrange
      component.tab = 1;

      // act
      component.ngOnInit();

      // assert
      expect(component).toBeTruthy();
      expect(component.isAllDate?.value).toBe(null);
    });

    it('when tab is not 1', () => {
      // arrange
      component.tab = 2;

      // act
      component.ngOnInit();

      // assert
      expect(component).toBeTruthy();
      expect(component.isAllDate?.value).toBeTrue();
    });
  });

  it('should call onCancelClicked', () => {
    // act
    component.onCancelClicked();

    // assert
    expect(modalSvcSpy.dismissAll).toHaveBeenCalled();
  });

  it('should call onExportClicked', () => {
    // arrange
    component.order = { id: 1 } as any;
    orderSvcSpy.exportOrder.and.returnValue(of({ data: {} }));
    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('mocked-url');

    // act
    component.onExportClicked();

    // assert
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(orderSvcSpy.exportOrder).toHaveBeenCalled();
  });

  describe('should call datePickerValues', () => {
    it('and set dateTo and dateFrom to null if value is falsy', () => {
      // act
      component.datePickerValues(null as any);

      // assert
      expect(component.dateTo?.value).toBeFalsy();
      expect(component.dateFrom?.value).toBeFalsy();
    });

    it('and set dateTo and dateFrom to value passed if value is valid', () => {
      // arrange
      const toDate = '08/08/2022';
      const fromDate = '08/10/2023';
      // act
      component.datePickerValues({ toDate, fromDate });
      // assert
      expect(component.dateTo?.value).toBe(toDate);
      expect(component.dateFrom?.value).toBe(fromDate);
    });
  });

  it('should call toggleAllAvailableDates', () => {
    // act
    component.toggleAllAvailableDates({ target: { checked: true } });

    // assert
    expect(component.isDatePickerDisabled).toBeTrue();
    expect(orderSvcSpy.isClearDatePicker).toBeTrue();
  });

  it('should call toggleDatePickerControl', () => {
    // act
    component.toggleDatePickerControl(false);

    // assert
    expect(component.dateTo?.hasValidator(Validators.required)).toBe(true);
    expect(component.dateFrom?.hasValidator(Validators.required)).toBe(true);
    expect(component.isDatePickerDisabled).toBeFalse();
  });
});
