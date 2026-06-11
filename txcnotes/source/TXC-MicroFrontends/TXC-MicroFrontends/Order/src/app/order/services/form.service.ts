import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExpirySchemeTypeEnum } from 'src/app/shared/enums/expiry-scheme-type.enum';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(){}
  handleSchemeChange(
    expirySchemeField: any,
    schemeValue: ExpirySchemeTypeEnum,
    dateFieldModel: any,
    dateField: any
  ): void {
    switch (schemeValue) {
      case ExpirySchemeTypeEnum.FixEndOfDay:
        dateFieldModel.datepickerType = 'calendar';
        this.setupField(dateField, dateFieldModel);
        break;
      case ExpirySchemeTypeEnum.FixNotEndOfDay:
        dateFieldModel.datepickerType = 'both';
        this.setupField(dateField, dateFieldModel);
        break;
      case ExpirySchemeTypeEnum.ThirdPartyFixEndOfDay:
        dateFieldModel.datepickerType = 'calendar';
        this.setupField(dateField, dateFieldModel);
        break;
      default:
        // BUGFIX 33158: Expiry scheme is always pristine, 
        // making the save button always disabled when editing expiry scheme value
        // if (!expirySchemeField?.touched) {
        //   expirySchemeField?.markAsUntouched();
        //   expirySchemeField?.markAsPristine();
        // }
        this.resetField(dateField);
        this.disableField(dateField, dateFieldModel);
        break;
    }
  }

  setupField(field: FormControl, fieldDefinition: InputModel) {
    this.resetField(field);
    this.enableField(field, fieldDefinition);
  }

  enableField(field: FormControl, fieldDefinition: InputModel) {
    fieldDefinition!.required = true;
    field!.enable();
  }

  disableField(field: FormControl, fieldDefinition: InputModel) {
    fieldDefinition!.required = false;
    field!.disable();
  }

  resetField(field: FormControl) {
    field!.setValue(null);
    field!.markAsUntouched();
    field!.markAsPristine();
  }

  getFieldByName(formModel: FormModel, name: string): InputModel {
    return formModel.fieldsDefinition.find(
      (field: InputModel) => field.formControlName === name
    ) as InputModel;
  }

  getControlByName(formGroup: FormGroup, name: string): FormControl {
    return formGroup.get(name) as FormControl;
  }
}
