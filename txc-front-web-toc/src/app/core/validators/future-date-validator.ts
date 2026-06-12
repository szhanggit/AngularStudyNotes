import { AbstractControl } from "@angular/forms";

export class FutureDateValidator {
    static futureDateValidator(ac: AbstractControl): {
        [key:string]: any | null
    }{

        if(!(ac.value)){
            return null;
        }
        
        let currentDate = new Date(Date.now());    
        const acDate = new Date(ac.value);


        if(acDate < currentDate){
            return {'futureDateValidator': { value : ac.value}};
        }else{
            return null;
        }
    }
}
