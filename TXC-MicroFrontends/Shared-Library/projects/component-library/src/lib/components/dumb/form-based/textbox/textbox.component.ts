import {
  Component,
  Input,
  OnInit,
  Output,
  Self,
  EventEmitter,
} from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { BaseControlComponent } from '../../../base-control/base-control.component';
import { InputModel } from '../../../../models/dumb-models/input.model';

@Component({
  selector: 'lib-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
})
export class TextboxLibComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() textBoxModel!: InputModel;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};

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
    const validators = control?.validator ? [control.validator] : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
      this.controlDir.control?.updateValueAndValidity();
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.textBoxModel.label} is mandatory.`,
      email: `${this.textBoxModel.label} is invalid.`,
      pattern:
        this.textBoxModel.validatorsErrorMessage?.pattern ??
        'N must be a positive integer.',
      min: this.textBoxModel.validatorsErrorMessage?.min ?? 'N is out of range',
      max:
        this.textBoxModel.validatorsErrorMessage?.max ?? 'N is out of range.',
      maxlength:
        this.textBoxModel.validatorsErrorMessage?.maxlength ??
        'Reached maximum length of required characters',
      invalidSkuCode:
        this.textBoxModel.validatorsErrorMessage?.invalidSkuCode ??
        'The SKU code does not exist',
    };
  }
}
