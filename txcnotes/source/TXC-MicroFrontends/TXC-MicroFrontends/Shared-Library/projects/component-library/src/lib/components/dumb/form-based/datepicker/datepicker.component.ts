import { Component, Input, OnInit, Self } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { BaseControlComponent } from '../../../base-control/base-control.component';
import { DatepickerModel } from '../../../../models/dumb-models/datepicker.model';
import { PickerType } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'lib-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerLibComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() datepickerModel!: DatepickerModel;
  @Input() isResetNeeded: boolean = true;
  controlName!: string;
  todayDate: Date = new Date();
  startDate = this.resetStartDate();
  errorMessages: { [key: string]: string } = {};

  get controlErrors() {
    if (this.controlDir.control?.errors) {
      return Object.keys(this.controlDir.control?.errors as ValidationErrors);
    }

    return [];
  }

  constructor(@Self() public controlDir: NgControl) {
    super();
    controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator ? [control.validator] : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();
  }

  resetStartDate(): Date {
    return new Date(
      this.todayDate.getFullYear(),
      this.todayDate.getMonth(),
      this.todayDate.getDate(),
      this.todayDate.getHours(),
      this.todayDate.getMinutes()
    );
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
    }
    if (!value) {
      this.startDate = this.resetStartDate();
    } else {
      this.startDate = value;
    }
  }

  dateChanged(value: Date): void {
    this.onChange(value);
    this.startDate = value;
  }

  clearDatepickerValue(): void {
    this.writeValue(null);
  }

  pickerType(): PickerType {
    return this.datepickerModel!.datepickerType;
  }

  placeholder(): string {
    if (this.datepickerModel.placeholder) {
      return this.datepickerModel.placeholder;
    }

    if (this.datepickerModel.datepickerType === 'calendar') {
      return 'YYYY/MM/DD';
    } else {
      return 'YYYY/MM/DD hh:mm a';
    }
  }

  minDate(): Date {
    if (this.value && this.value < new Date()) {
      return this.value;
    }

    if (this.datepickerModel.customMinDate) {
      return new Date(this.datepickerModel.minDate!);
    } else {
      if (this.datepickerModel.datepickerType === 'calendar') {
        return new Date(
          this.todayDate.getFullYear(),
          this.todayDate.getMonth(),
          this.todayDate.getDate()
        );
      } else {
        return new Date(
          this.todayDate.getFullYear(),
          this.todayDate.getMonth(),
          this.todayDate.getDate(),
          this.todayDate.getHours(),
          this.todayDate.getMinutes()
        );
      }
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.datepickerModel.label} is mandatory.`,
    };
  }
}
