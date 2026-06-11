import { AbstractControl } from "@angular/forms";

export class PhoneNumberValidator {
    static isValidPhoneNumber() {
        const pattern = /^\s*(?:\+?(\(\d{1,3}\)|\d{1,4}))?[-. ()]*(\d{2,5})[-. ]*(\d{3,5})(?:\s*x (\d+))?\s*$/;
        
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (!control.value || pattern.test(control.value.toString().toLowerCase().trim())) {
            return null;
          }
          return { invalidPhoneNumber: true };
        };
      }
}