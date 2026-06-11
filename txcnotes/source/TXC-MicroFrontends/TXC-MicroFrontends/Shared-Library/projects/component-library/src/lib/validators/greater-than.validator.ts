import { AbstractControl } from "@angular/forms";

export class GreaterThanValidator {
  static isGreaterThan(num: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!isNaN(control.value) && control.value > num) {
        return null;
      }
      return { 
        greaterThan: {
          actual: control.value,
          greaterThan: num,
        }
      };
    };
  }
}