import { AbstractControl } from "@angular/forms";

export class PhoneNumberValidator {
    static isValidPhoneNumber() {
        const pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (!control.value || pattern.test(control.value.toLowerCase().trim())) {
            return null;
          }
          return { invalidPhoneNumber: true };
        };
      }
}