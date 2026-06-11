import { AbstractControl } from "@angular/forms";

export class UENNumberValidator {
    static isValidUENNumber() {
        const pattern = /^[\w\s.'-]+$/;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (!control.value || pattern.test(control.value.toString().toLowerCase().trim())) {
            return null;
          }
          return { invalidNumber: true };
        };
      }
}