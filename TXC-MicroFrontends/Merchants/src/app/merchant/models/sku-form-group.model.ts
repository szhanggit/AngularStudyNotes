import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CharacterValidator } from "../validators/character.validator";

export class SKUFormGroup {
     define(_formBuilder: FormBuilder, addDefaultCost : boolean = false,isEdit : Boolean =false): FormGroup {        
        const result = _formBuilder.group({
            name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(128),CharacterValidator.stringWithOnlyWhiteSpace()]),
            number: new FormControl({ value: '', disabled: isEdit }, [Validators.required, Validators.maxLength(128),CharacterValidator.stringWithOnlyWhiteSpace()]),
            type: new FormControl({ value: '', disabled: isEdit }, [Validators.required]),
            facevalue: new FormControl({ value: '', disabled: isEdit }, [Validators.required, CharacterValidator.allowDecimal(8,2, 20000000)]),
            vnr: new FormControl({ value: '', disabled: isEdit }, [Validators.required]),
            multiplier: new FormControl({ value: '1', disabled: false }, [Validators.required, Validators.min(1),Validators.max(500)]),
            costs: new FormArray([]),
          });
          if(addDefaultCost){
            let costs = result.get('costs') as FormArray;
            costs.push(_formBuilder.group({                
                cost: new FormControl({ value: '', disabled: false }, [Validators.required,CharacterValidator.allowDecimal(11,4)]) ,
                period: new FormControl({ value: '', disabled: false }, [Validators.required]),
                isFuturePeriod: new FormControl({ value: true, disabled: true }), 
                validStartDate: new FormControl({ value: '', disabled: true }),
                costIndex: new FormControl({ value: 0, disabled: false }),
                isActive: new FormControl({ value: true, disabled: false }),
                costwithouttax : new FormControl({ value: '', disabled: true }),
            }));
        }

        return result;
    }
}
