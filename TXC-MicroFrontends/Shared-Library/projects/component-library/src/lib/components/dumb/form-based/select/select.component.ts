import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { BaseControlComponent } from '../../../base-control/base-control.component';
import { SelectModel } from '../../../../models/dumb-models/select.model';

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectLibComponent extends BaseControlComponent implements OnInit {
  @Input() selectModel!: SelectModel;
  @Input()  customClass!: string;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;
  firstLoad = true;

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

  onSelectUpdate(value: number | null): void {
    if (this.firstLoad) {
      this.firstLoad = false;
      return;
    }
    
    this.onChange(value);
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.selectModel.label} is mandatory.`
    };
  }
}
