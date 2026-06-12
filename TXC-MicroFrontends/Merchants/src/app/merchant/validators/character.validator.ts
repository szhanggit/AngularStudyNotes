import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CharacterValidator {
    static allowAlphanumericWithChinese() {
        const NOT_ALLOWED_CHAR = "~`!@#$%^&*()-_+={}[]|\\:;\"'<>,./?";
        return (control:AbstractControl) : ValidationErrors | null => {
            const value = control.value;    
            if (!value) {
                return null;
            }
            const chars = value.split('');
            let isvalid = true;
            for (let index = 0; index < chars.length; index++) {
                if(NOT_ALLOWED_CHAR.includes(chars[index])){
                    isvalid = false;
                    break;
                }                
            }
            return !isvalid ? {allowAlphanumericWithChinese:true}: null;
        }
    }    
    static allowAlphanumericChineseWithSpecialChar(allowedSpecialCharater : string) {
        const NOT_ALLOWED_CHAR = "~`!@#$%^&*()-_+={}[]|\\:;\"'<>,./?";
        return (control:AbstractControl) : ValidationErrors | null => {
            const value = control.value;    
            if (!value) {
                return null;
            }
            const chars = value.split('');
            let isvalid = true;
            for (let index = 0; index < chars.length; index++) {
                if(!allowedSpecialCharater.includes(chars[index]) && NOT_ALLOWED_CHAR.includes(chars[index])){
                    isvalid = false;
                    break;
                }                
            }
            return !isvalid ? {allowAlphanumericWithChinese:true}: null;
        }
  }

    static allowDecimal(beforeDecimalPlace : number, afterDecimalPlace : number, allowedMaxNumber? : number) {         
       return (control: AbstractControl): any | null => {
        var parent = control["_parent"];  //to get the control name.
        console.log("control", control);  
        let allowDecimal = false;
        let msg="";
        let maxNumber = allowedMaxNumber ? allowedMaxNumber.toFixed(afterDecimalPlace) : ("9".repeat(beforeDecimalPlace)+"."+"9".repeat(afterDecimalPlace));
        if (control.value ){
          var isChar=  isNaN(control.value);
               if(isChar== true)
               {
                allowDecimal = true;
                msg=` Entered value is Invalid`;
               }
               else if(Number(maxNumber) < Number(control.value) ){
                allowDecimal = true;
                msg=`Entered value exceeds the maximum value ${maxNumber}`;
               }              
                else{                    
                    if(parent.controls.cost!= undefined && parent.controls.cost.value < 0 )
                    {
                        let splitValue = control.value.toString().split(".");
                        var int_num_BeforeDecimal = BigInt(splitValue[0].replace('-','')).toString();          
                        if(int_num_BeforeDecimal.length <= beforeDecimalPlace) { 
                            if(splitValue.length > 1 && (splitValue[1].length == 0 || splitValue[1].length > afterDecimalPlace)) {
                                allowDecimal = true;
                                msg=`Only ${afterDecimalPlace} decimal places are allowed`;
                             }
                        }                        
                         else{
                                allowDecimal = true;
                                msg=`Entered value is less than the minimum value - ${maxNumber}`;   
                         }
                    }
                    else if(parent.controls.type != undefined && parent.controls.type.value ==2)
                    {
                        if(parent.controls.facevalue != undefined && (parent.controls.facevalue.value == 0 ||  parent.controls.facevalue.value < 0))
                        {
                            allowDecimal = true;                   
                            msg=`Entered value should be greater than 0!`;  
                        }
                        else{
                            let splitValue = control.value.toString().split(".");                         
                            var int_num_BeforeDecimal = BigInt(splitValue[0]).toString();          
                            if(int_num_BeforeDecimal.length <= beforeDecimalPlace) { 
                               if(splitValue.length > 1 && (splitValue[1].length == 0 || splitValue[1].length > afterDecimalPlace)) {
                                  allowDecimal = true;
                                  msg=`Only ${afterDecimalPlace} decimal places are allowed`;
                               }        
                            }
                            else{
                                    allowDecimal = true;                   
                                    msg=`Entered value exceeds the maximum value ${maxNumber}`;                         
                            }
                        }
                    }
                    else{                        
                        let splitValue = control.value.toString().split(".");                         
                        var int_num_BeforeDecimal = BigInt(splitValue[0]).toString();          
                        if(int_num_BeforeDecimal.length <= beforeDecimalPlace) { 
                           if(splitValue.length > 1 && (splitValue[1].length == 0 || splitValue[1].length > afterDecimalPlace)) {
                              allowDecimal = true;
                              msg=`Only ${afterDecimalPlace} decimal places are allowed`;
                           }        
                        }
                        else{
                                allowDecimal = true;                   
                                msg=`Entered value exceeds the maximum value ${maxNumber}`;                         
                        }
                    }
            }
        }
        return allowDecimal ? { allowDecimal:allowDecimal,msg:msg } : null;
       };
    }
    static stringWithOnlyWhiteSpace() {        
        return (control: AbstractControl): { [key: string]: boolean } | null => {
         if (control.value.toString().toLowerCase().trim() != "") {           
              return null;
            }
            return { stringWithOnlyWhiteSpace: true };
        };
     }
}
