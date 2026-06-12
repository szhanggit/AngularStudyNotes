import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatepickerLibComponent, DatepickerModel } from 'projects/component-library/src/public-api';

describe('DatepickerLibComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };

  let component: DatepickerLibComponent;
  let fixture: ComponentFixture<DatepickerLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerLibComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DatepickerLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatepickerLibComponent);
    component = fixture.componentInstance;
    component.datepickerModel = {
      label: 'test',
    } as DatepickerModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('controlErrors()', () => {
    it('should return []', () => {
      // assert
      expect(component.controlErrors).toEqual([]);
    });

    it('should return errors', () => {
      // arrange
      component.controlDir.control?.setErrors({ required: true });

      // assert
      expect(component.controlErrors).toEqual(['required']);
    });
  });

  describe('writeValue()', () => {
    it('should reset startDate', () => {
      // act
      component.writeValue(null);

      // assert
      expect(component.startDate).toBeTruthy();
      expect(component.value).toBeFalsy();
    });

    it('should reset startDate and value is defined', () => {
      // act
      component.writeValue(new Date());

      // assert
      expect(component.startDate).toBeTruthy();
      expect(component.value).toBeTruthy();
    });
  });

  describe('dateChanged()', () => {
    it('should set the value', () => {
      // act
      component.dateChanged(new Date());

      // assert
      expect(component.startDate).toBeTruthy();
    });
  });

  describe('clearDatepickerValue()', () => {
    it('should set the value to null', () => {
      // act
      component.clearDatepickerValue();

      // assert
      expect(component.value).toBeFalsy();
    });
  });

  describe('placeholder()', () => {
    it('should return no time format', () => {
      // arrange
      const expectedPlaceholder = 'YYYY/MM/DD';
      component.datepickerModel = {
        datepickerType: 'calendar',
      } as any;

      // act
      const actualPlaceholder = component.placeholder();

      // assert
      expect(actualPlaceholder).toBe(expectedPlaceholder);
    });

    it('should return with time format', () => {
      // arrange
      const expectedPlaceholder = 'YYYY/MM/DD hh:mm a';
      component.datepickerModel = {
        datepickerType: 'both',
      } as any;

      // act
      const actualPlaceholder = component.placeholder();

      // assert
      expect(actualPlaceholder).toBe(expectedPlaceholder);
    });
  });

  describe('minDate()', () => {
    it('should return current value', () => {
      // arrange
      const currentDate = new Date('2022/12/12');
      component.value = currentDate;

      // act
      const actualMinDate = component.minDate();

      // assert
      expect(actualMinDate).toBe(currentDate);
    });

    xit('should return the customMinDate', () => {
      // arrange
      const currentDate = new Date();
      const expectedMinDate = new Date('2022/12/12');
      component.datepickerModel = {
        customMinDate: true,
        minDate: expectedMinDate,
      } as any;
      component.value = currentDate;

      // act
      const actualMinDate = component.minDate();

      // assert
      expect(actualMinDate).toEqual(expectedMinDate);
    });

    it('should return the customMinDate with no time for calendar only view', () => {
      // arrange
      const expectedMinDate = new Date(
        component.todayDate.getFullYear(),
        component.todayDate.getMonth(),
        component.todayDate.getDate()
      );
      component.datepickerModel = {
        datepickerType: 'calendar',
      } as any;
      component.value = null;

      // act
      const actualMinDate = component.minDate();

      // assert
      expect(actualMinDate).toEqual(expectedMinDate);
    });
  });
});
