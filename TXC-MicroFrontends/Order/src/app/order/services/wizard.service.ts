import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';
import { OrderMode } from '../models/quotation-type.model';
import { OrderModeEnum } from '../enums/order-mode.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { ORDER_CONSTANTS } from '../constants/order-constants';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private _wizardStepsReached$ = new BehaviorSubject<number[]>([]);
  private _productSelectionTouched$ = new BehaviorSubject<boolean>(false);
  productSelectionDirty: boolean = false;

  constructor() {}

  get wizardStepsReached$() {
    return this._wizardStepsReached$.asObservable();
  }

  set wizardStepsReached(steps: number[]) {
    this._wizardStepsReached$.next(steps);
  }

  get productSelectionTouched$() {
    return this._productSelectionTouched$.asObservable();
  }

  set productSelectionTouched(isDirty: boolean) {
    this._productSelectionTouched$.next(isDirty);
  }

  getWizardSteps(orderType: OrderMode) {
    switch (orderType.key) {
      case OrderModeEnum.PaperVoucher:
        return ORDER_CONSTANTS.WIZARD_STEPS.THREE_STEPS;
      default:
        return ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS;
    }
  }

  resetWizardPropertiesState() {
    this.wizardStepsReached = [];
    this.productSelectionDirty = false;
    this.productSelectionTouched = false;
  }

  checkFormValidation(
    form: FormGroup,
    emitter: EventEmitter<boolean>,
    destroyed$: Subject<boolean>,
    deliveryDetailsStep: boolean = false
  ) {
    combineLatest([form.valueChanges, this.wizardStepsReached$])
      .pipe(takeUntil(destroyed$))
      .subscribe(([_, steps]) => {
        const formDone = deliveryDetailsStep
          ? steps.length > 3
          : steps.length > 1;

        for (const [_, value] of Object.entries(form.controls)) {
          const formControl = value as FormControl;
          if (formDone && !formControl.disabled) {
            formControl.markAsTouched();
            formControl.markAsDirty();
          }
          if (formControl.dirty && formControl.invalid) {
            emitter.emit(true);
            return;
          }
          emitter.emit(false);
        }
      });
  }
}
