import { AbstractControl } from "@angular/forms";

export class NumberValidator {
    static isValidNumber() {
        const pattern = /^-?\d+\.?\d*$/;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (!control.value || pattern.test(control.value.toLowerCase().trim())) {
            return null;
          }
          return { invalidNumber: true };
        };
      }
}