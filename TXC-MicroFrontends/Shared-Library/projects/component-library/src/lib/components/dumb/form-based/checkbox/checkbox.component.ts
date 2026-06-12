import { Component, Input, OnInit, Output, EventEmitter, Self } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { BaseControlComponent } from '../../../base-control/base-control.component';
import { InputModel } from '../../../../models/dumb-models/input.model';





@Component({
  selector: 'lib-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxLibComponent extends BaseControlComponent implements OnInit {
  @Input() checkboxModel!: InputModel;

  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;

  constructor(@Self() public controlDir: NgControl) {
    super();
    controlDir.valueAccessor = this;
  }

  get controlErrors() {
    if (this.controlDir.control?.errors) {
      return Object.keys(this.controlDir.control?.errors as ValidationErrors);
    }

    return [];
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator
      ? [control.validator]
      : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.checkboxModel.label} is required!`,
    };
  }
}
