import { Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-base-control',
  template: '',
  styles: [],
})
export abstract class BaseControlComponent implements ControlValueAccessor {
  disabledControl!: boolean;
  value: any;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {}

  abstract writeValue(value: any): void;

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledControl = disabled;
  }
}
