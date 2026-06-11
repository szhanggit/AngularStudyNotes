import { TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { WizardService } from './wizard.service';
import { OrderModeEnum } from '../enums/order-mode.enum';
import { ORDER_CONSTANTS } from '../constants/order-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

describe('WizardService', () => {
  let service: WizardService;
  let formGroup: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WizardService, FormBuilder],
    });
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    formGroup = fb.group({
      field: ['', Validators.required],
      field2: { value: '', disabled: true },
    });

    service = TestBed.inject(WizardService);
  }));

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('getWizardSteps()', () => {
    it('should return FOUR STEPS', () => {
      // act
      const actualSteps = service.getWizardSteps({
        key: OrderModeEnum.IndirectNonAPI,
      } as any);

      // assert
      expect(actualSteps).toEqual(ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS);
    });

    it('should return FOUR STEPS', () => {
      // act
      const actualSteps = service.getWizardSteps({
        key: OrderModeEnum.DirectNonAPI,
      } as any);

      // assert
      expect(actualSteps).toEqual(ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS);
    });

    it('should return FOUR STEPS', () => {
      // act
      const actualSteps = service.getWizardSteps({
        key: OrderModeEnum.API,
      } as any);

      // assert
      expect(actualSteps).toEqual(ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS);
    });

    it('should return THREE STEPS', () => {
      // act
      const actualSteps = service.getWizardSteps({
        key: OrderModeEnum.PaperVoucher,
      } as any);

      // assert
      expect(actualSteps).toEqual(ORDER_CONSTANTS.WIZARD_STEPS.THREE_STEPS);
    });
  });

  describe('resetWizardPropertiesState()', () => {
    it('should reset properties', fakeAsync(() => {
      // arrange
      service.wizardStepsReached = [1];
      service.productSelectionDirty = true;
      service.productSelectionTouched = true;

      // act
      service.resetWizardPropertiesState();
      tick();

      // assert
      service.wizardStepsReached$.subscribe((actualStepsReached) => {
        expect(actualStepsReached).toEqual([]);
      });
      service.productSelectionTouched$.subscribe((actualSelectionTouched) => {
        expect(actualSelectionTouched).toBeFalse();
      });
      expect(service.productSelectionDirty).toBeFalse();
    }));
  });

  describe('checkFormValidation()', () => {
    it('should emit false if valid', () => {
      // arrange
      const actualEmitter = { emit: jasmine.createSpy() };
      const actualDestroyed = new Subject<boolean>();

      // act
      service.checkFormValidation(
        formGroup,
        actualEmitter as any,
        actualDestroyed
      );
      formGroup.patchValue({ field: 'test' });

      // assert
      expect(actualEmitter.emit).toHaveBeenCalledWith(false);
    });

    it('should emit true if invalid', fakeAsync(() => {
      // arrange
      const actualEmitter = { emit: jasmine.createSpy() };
      const actualDestroyed = new Subject<boolean>();
      const fieldControl = formGroup.get('field');
      service.wizardStepsReached = [1,2,3,4];

      // act
      service.checkFormValidation(
        formGroup,
        actualEmitter as any,
        actualDestroyed,
        true
      );
      fieldControl?.patchValue(null);
      tick(100);

      // assert
      expect(actualEmitter.emit).toHaveBeenCalledWith(true);
    }));
  });
});
