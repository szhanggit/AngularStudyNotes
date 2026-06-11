import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { CharacterValidator } from "../validators/character.validator";

export class AcceptanceLoopFormGroup {
    define(_formBuilder: FormBuilder): FormGroup {
        const result = _formBuilder.group({
            code: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]),
            description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
            lastUpdatedOn: new FormControl({ value: (new Date()).toLocaleDateString(), disabled: false }),
        });

        return result;
    }
}
