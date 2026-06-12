import { TestBed, inject } from '@angular/core/testing';

import { FormService } from './form.service';
import { ExpirySchemeTypeEnum } from 'src/app/shared/enums/expiry-scheme-type.enum';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('FormService', () => {
  let service: FormService;
  let formGroup: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormService, FormBuilder],
    });
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    formGroup = fb.group({
      field: '',
    });

    service = TestBed.inject(FormService);
  }));

  it('should be created', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('handleSchemeChange()', () => {
    it('should set datefield to calendar and call setupField for FixEndOfDay', () => {
      // arrange
      const actualDateField = { datepickerType: '' };
      const setupFieldSpy = spyOn(service, 'setupField');

      // act
      service.handleSchemeChange(
        {},
        ExpirySchemeTypeEnum.FixEndOfDay,
        actualDateField,
        {}
      );

      // assert
      expect(actualDateField.datepickerType).toBe('calendar');
      expect(setupFieldSpy).toHaveBeenCalledWith(
        {} as any,
        actualDateField as any
      );
    });

    it('should set datefield to both and call setupField for FixNotEndOfDay', () => {
      // arrange
      const actualDateField = { datepickerType: '' };
      const setupFieldSpy = spyOn(service, 'setupField');

      // act
      service.handleSchemeChange(
        {},
        ExpirySchemeTypeEnum.FixNotEndOfDay,
        actualDateField,
        {}
      );

      // assert
      expect(actualDateField.datepickerType).toBe('both');
      expect(setupFieldSpy).toHaveBeenCalledWith(
        {} as any,
        actualDateField as any
      );
    });

    it('should set datefield to calendar and call setupField for ThirdPartyFixEndOfDay', () => {
      // arrange
      const actualDateField = { datepickerType: '' };
      const setupFieldSpy = spyOn(service, 'setupField');

      // act
      service.handleSchemeChange(
        {},
        ExpirySchemeTypeEnum.ThirdPartyFixEndOfDay,
        actualDateField,
        {}
      );

      // assert
      expect(actualDateField.datepickerType).toBe('calendar');
      expect(setupFieldSpy).toHaveBeenCalledWith(
        {} as any,
        actualDateField as any
      );
    });

    it('should call resetField and call disableField for Others', () => {
      // arrange
      const actualDateField = { datepickerType: '' };
      const resetFieldSpy = spyOn(service, 'resetField');
      const disableFieldSpy = spyOn(service, 'disableField');

      // act
      service.handleSchemeChange(
        {},
        ExpirySchemeTypeEnum.Others,
        actualDateField,
        {}
      );

      // assert
      expect(resetFieldSpy).toHaveBeenCalledWith({} as any);
      expect(disableFieldSpy).toHaveBeenCalledWith(
        {} as any,
        actualDateField as any
      );
    });
  });

  describe('setupField()', () => {
    it('should call resetField and enableField', () => {
      // arrange
      const expectedField = {} as any;
      const expectedDefinition = {} as any;
      const resetFieldSpy = spyOn(service, 'resetField');
      const enableField = spyOn(service, 'enableField');

      // act
      service.setupField(expectedField, expectedDefinition);

      // assert
      expect(resetFieldSpy).toHaveBeenCalledWith(expectedField);
      expect(enableField).toHaveBeenCalledWith(
        expectedField,
        expectedDefinition
      );
    });
  });

  describe('enableField()', () => {
    it('should set required to true and enable field', () => {
      // arrange
      const expectedField = { enable: jasmine.createSpy() } as any;
      const expectedDefinition = { required: false } as any;

      // act
      service.enableField(expectedField, expectedDefinition);

      // assert
      expect(expectedDefinition.required).toBeTrue();
      expect(expectedField.enable).toHaveBeenCalled();
    });
  });

  describe('disableField()', () => {
    it('should set required to false and disable field', () => {
      // arrange
      const expectedField = { disable: jasmine.createSpy() } as any;
      const expectedDefinition = { required: false } as any;

      // act
      service.disableField(expectedField, expectedDefinition);

      // assert
      expect(expectedDefinition.required).toBeFalse();
      expect(expectedField.disable).toHaveBeenCalled();
    });
  });

  describe('resetField()', () => {
    it('should reset field status', () => {
      // arrange
      const expectedField = {
        setValue: jasmine.createSpy(),
        markAsUntouched: jasmine.createSpy(),
        markAsPristine: jasmine.createSpy(),
      } as any;

      // act
      service.resetField(expectedField);

      // assert
      expect(expectedField.setValue).toHaveBeenCalledWith(null);
      expect(expectedField.markAsUntouched).toHaveBeenCalled();
      expect(expectedField.markAsPristine).toHaveBeenCalled();
    });
  });

  describe('getFieldByName()', () => {
    it('should return field', () => {
      // arrange
      const expectField = { formControlName: 'field' } as any;
      const formModel = {
        fieldsDefinition: [
          {
            ...expectField,
          },
        ],
      };

      // act
      const actualField = service.getFieldByName(formModel as any, 'field');

      // assert
      expect(actualField).toEqual(expectField);
    });
  });

  describe('getControlByName()', () => {
    it('should return field', () => {
      // act
      const actualField = service.getControlByName(formGroup, 'field');

      // assert
      expect(actualField).toBeDefined();
    });
  });
});
