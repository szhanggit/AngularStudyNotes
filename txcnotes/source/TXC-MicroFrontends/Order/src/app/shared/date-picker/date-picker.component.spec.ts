import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { DatePickerType } from 'src/app/order/enums/date-picker-type.enum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      imports: [HttpClientTestingModule],
      providers: [OrderService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clearDatePickerOnCheck()', () => {
    it('should call onDatePickerReset', () => {
      // arrange
      component.rangeDp = { writeValue: jasmine.createSpy() } as any;

      // act
      (component as any).orderSvc.isClearDatePicker = true;

      // assert
      expect(component.selectedDateRange).toBe('');
      expect(component.fromDate).toBe(null);
      expect(component.toDate).toBe(null);
      expect(component.rangeDp.writeValue).toHaveBeenCalledWith(null);
    });
  });

  describe('onDateSelection()', () => {
    it('should emit and set isDateRangeInvalid to false and set fromDate', () => {
      // arrange
      const datePickerValues = spyOn(component.datePickerValues, 'emit');
      component.isDateRangeInvalid = true;
      component.type = DatePickerType.RANGE;

      // act
      component.onDateSelection({} as any);

      // assert
      expect(datePickerValues).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
      expect(component.fromDate).toEqual({} as any);
    });

    it('should emit and set isDateRangeInvalid to false and set toDate', () => {
      // arrange
      const datePickerValues = spyOn(component.datePickerValues, 'emit');
      component.isDateRangeInvalid = true;
      component.type = DatePickerType.RANGE;
      component.fromDate = new NgbDate(2022, 8, 8);

      // act
      component.onDateSelection(new NgbDate(2023, 8, 8));

      // assert
      expect(datePickerValues).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
      expect(component.toDate).toEqual(new NgbDate(2023, 8, 8));
    });

    it('should emit and set isDateRangeInvalid to false and set fromDate', () => {
      // arrange
      const datePickerValues = spyOn(component.datePickerValues, 'emit');
      component.isDateRangeInvalid = true;
      component.type = DatePickerType.RANGE;
      component.fromDate = new NgbDate(2022, 8, 8);
      const dummyDate = {
        after: () => {
          return;
        },
      } as any;

      // act
      component.onDateSelection(dummyDate);

      // assert
      expect(datePickerValues).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
      expect(component.toDate).toBeFalsy();
      expect(component.fromDate).toBe(dummyDate);
    });

    it('should emit and set isDateRangeInvalid to false', () => {
      // arrange
      const datePickerValues = spyOn(component.datePickerValues, 'emit');
      component.isDateRangeInvalid = true;
      component.type = DatePickerType.SIMPLE;

      // act
      component.onDateSelection({} as any);

      // assert
      expect(datePickerValues).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
    });
  });

  describe('isHovered()', () => {
    it('should return false when invalid value', () => {
      // act
      const actualValue = component.isHovered({} as any);

      // assert
      expect(actualValue).toBeFalsy();
    });

    it('should return true when valid value', () => {
      // arrange
      component.fromDate = new NgbDate(2022, 8, 8);
      component.toDate = null;
      component.hoveredDate = {} as any;

      // act
      const actualValue = component.isHovered({
        after: () => {
          return true;
        },
        before: () => {
          return true;
        },
      } as any);

      // assert
      expect(actualValue).toBeTruthy();
    });
  });

  describe('isInside()', () => {
    it('should return false when invalid value', () => {
      // act
      const actualValue = component.isInside({} as any);

      // assert
      expect(actualValue).toBeFalsy();
    });

    it('should return true when valid value', () => {
      // arrange
      component.toDate = new NgbDate(2023, 8, 8);
      component.hoveredDate = {} as any;

      // act
      const actualValue = component.isInside({
        after: () => {
          return true;
        },
        before: () => {
          return true;
        },
      } as any);

      // assert
      expect(actualValue).toBeTruthy();
    });
  });

  describe('isRange()', () => {
    it('should return false when invalid value', () => {
      // act
      const actualValue = component.isRange({
        equals: () => {
          return false;
        },
      } as any);

      // assert
      expect(actualValue).toBeFalsy();
    });

    it('should return true when valid value', () => {
      // arrange
      component.toDate = new NgbDate(2023, 8, 8);
      component.hoveredDate = {} as any;

      // act
      const actualValue = component.isRange({
        after: () => {
          return true;
        },
        before: () => {
          return true;
        },
        equals: () => {
          return false;
        },
      } as any);

      // assert
      expect(actualValue).toBeTruthy();
    });
  });

  describe('convertToNgbDate()', () => {
    it('should return NgbDate', () => {
      // arrange
      const expectedValue = new NgbDate(2022, 8, 8);

      // act
      const actualValue = component.convertToNgbDate('2022/08/08');

      // assert
      expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('onDeleteValues()', () => {
    it('should reset', () => {
      // arrange
      const deleteDatesByKeyboard = spyOn(
        component.deleteDatesByKeyboard,
        'emit'
      );
      component.rangeDp = { writeValue: jasmine.createSpy() } as any;

      // act
      component.onDeleteValues();

      // assert
      expect(deleteDatesByKeyboard).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
      expect(component.selectedDateRange).toBe('');
      expect(component.fromDate).toBe(null);
      expect(component.toDate).toBe(null);
      expect(component.rangeDp.writeValue).toHaveBeenCalledWith(null);
    });
  });

  describe('onDatePickerInputChange()', () => {
    it('should not do anything if value is empty', () => {
      // arrange
      component.selectedDateRange = '2022/12/12';
      component.isDateRangeInvalid = false;

      // act
      component.onDatePickerInputChange({ target: { value: '' } });

      // assert
      expect(component.selectedDateRange).toBe('2022/12/12');
      expect(component.isDateRangeInvalid).toBeFalse();
    });

    it('should set the value if valid', () => {
      // arrange
      component.selectedDateRange = '2022/12/12 - 2023/12/12';
      component.isDateRangeInvalid = true;

      // act
      component.onDatePickerInputChange({
        target: { value: '2022/08/08 - 2023/08/08' },
      });

      // assert
      expect(component.selectedDateRange).toBe('2022/08/08-2023/08/08');
      expect(component.isDateRangeInvalid).toBeFalse();
    });

    it('should set the value if valid but set the invalid date range if range is not valid a range', () => {
      // arrange
      component.selectedDateRange = '2022/12/12 - 2023/12/12';
      component.isDateRangeInvalid = false;

      // act
      component.onDatePickerInputChange({
        target: { value: '2022/08/08 - 2021/08/08' },
      });

      // assert
      expect(component.selectedDateRange).toBe('2022/08/08-2021/08/08');
      expect(component.isDateRangeInvalid).toBeTrue();
    });

    it('should set the value to empty and set the invalid to true if value is invalid', () => {
      // arrange
      component.selectedDateRange = '2022/12/12';
      component.isDateRangeInvalid = false;

      // act
      component.onDatePickerInputChange({ target: { value: 'asd' } });

      // assert
      expect(component.selectedDateRange).toBeFalsy();
      expect(component.isDateRangeInvalid).toBeTrue();
    });

    it('should set the value to empty if value is invalid and call deleteValues if deleteContentBackward', () => {
      // arrange
      component.selectedDateRange = '2022/12/12';
      component.isDateRangeInvalid = false;
      const deleteDatesByKeyboard = spyOn(
        component.deleteDatesByKeyboard,
        'emit'
      );
      component.rangeDp = { writeValue: jasmine.createSpy() } as any;

      // act
      component.onDatePickerInputChange({
        target: { value: 'asd' },
        inputType: 'deleteContentBackward',
      });

      // assert
      expect(component.selectedDateRange).toBeFalsy();
      expect(deleteDatesByKeyboard).toHaveBeenCalled();
      expect(component.isDateRangeInvalid).toBeFalse();
      expect(component.selectedDateRange).toBe('');
      expect(component.fromDate).toBe(null);
      expect(component.toDate).toBe(null);
      expect(component.rangeDp.writeValue).toHaveBeenCalledWith(null);
    });
  });
});
