import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { BaseControlComponent } from '../../../base-control/base-control.component';
import { RadioButtonModel } from '../../../../models/dumb-models/radio-button.model';

@Component({
  selector: 'lib-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonLibComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() radioButtonModel!: RadioButtonModel;
  @Input() columns!: number | undefined;
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
    const validators = control?.validator ? [control.validator] : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();
  }

  getStyleClass(): string {
    if (this.columns) {
      return `col-${this.columns}`;
    }
    return 'col-6';
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.radioButtonModel.label} is required!`,
    };
  }
}
