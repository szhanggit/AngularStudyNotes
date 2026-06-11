import { AbstractControl } from "@angular/forms";

export class AlreadyExistValidator {
    static isAlreadyExists(values: string[]) {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (!control.value || !values.includes(control.value.toLowerCase().trim())) {
            return null;
          }
          return { alreadyExists: true };
        };
      }
}
