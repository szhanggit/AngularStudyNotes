import { AbstractControl } from "@angular/forms";

export class AlreadyExistValidator {
    static isAlreadyExists(values: (string | undefined)[], isCaseSensitive: boolean = true) {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (!control.value 
                || (!isCaseSensitive && !values.includes(control.value.toLowerCase().trim()))
                || (isCaseSensitive && !values.includes(control.value.trim())) 
            ) {
                return null;
            }
            return { alreadyExists: true };
        };
    }
}
