import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { BaseControlComponent } from '../base-control.component';
import { NgControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() toggleButtonModel!: InputModel;
  @Output() blur: EventEmitter<any> = new EventEmitter();
  hasError = false;
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

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.toggleButtonModel.label} is required!`,
    };
  }
}
