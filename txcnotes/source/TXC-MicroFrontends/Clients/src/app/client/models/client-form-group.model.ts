import { FormArray,FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../validators/number.validator";
import { PhoneNumberValidator } from "../validators/phone-number.validator";
import { IDefineFormGroup } from "./define-form-group.model";

abstract class BaseDefinitionClientFormGroup {
    protected createClientEmail(): FormGroup {
        return new FormGroup({
            'emailAddress': new FormControl('', [Validators.email]),
        });
    }

    protected createInternalEmail(): FormGroup {
        return new FormGroup({
            'internalEmailAddress': new FormControl('', Validators.email),
        });
    }

    /// Input Validations
    protected commonDef(_formBuilder: FormBuilder, isEdit: boolean , addDefaultContact=false,controlId=""): FormGroup {
        const result = _formBuilder.group({
            clientName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            businessType : new FormControl({ value: '', disabled: false }, []), 
            description : new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]), 
            securityKey: new FormControl({ value: '', disabled: true }),
            securityAlgo : new FormControl({ value: '1', disabled: false }),
            identityCode : new FormControl({ value: '', disabled: true }),
            salesEmail : new FormControl({ value: '', disabled: false },[Validators.email,Validators.maxLength(255)] ),
            contactPersonName : new FormControl({ value: '', disabled: false },[Validators.maxLength(30)]),
            contacPersonJobTitle : new FormControl({ value: '', disabled: false },[Validators.maxLength(100)]),
            contactEmail : new FormControl({ value: '', disabled: false },[Validators.email,Validators.maxLength(255)]),
            contactPhoneNumber : new FormControl({ value: '', disabled: false },[Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
            country : new FormControl({ value: '', disabled: false }, [Validators.required]),
            state : new FormControl({ value: '', disabled: false }, [Validators.required]),
            city : new FormControl({ value: '', disabled: false }, [Validators.required]),
            district : new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(100)]),
            detailAddress : new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(500)]),
            postcode : new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(20)]),            
            memo : new FormControl({ value: '', disabled: false },[Validators.maxLength(2000)]), 
            status:new FormControl({ value: '', disabled: false }),
            contactDetails: new FormArray([])
        });

        if(addDefaultContact){
            let contactDetails = result.get('contactDetails') as FormArray;
            contactDetails.push(_formBuilder.group({                
            contactid : new FormControl({ value: controlId, disabled: false }),    
            newcontactPersonName : new FormControl({ value: '', disabled: false },[Validators.maxLength(30)]),
            newcontacPersonJobTitle : new FormControl({ value: '', disabled: false },[Validators.maxLength(100)]),
            newcontactEmail : new FormControl({ value: '', disabled: false },[Validators.email,Validators.maxLength(255)]),
            newcontactPhoneNumber : new FormControl({ value: '', disabled: false },[Validators.maxLength(15)]),
            isActive: new FormControl({ value: true, disabled: false }),
            isUpdated: new FormControl({ value: false, disabled: false }),
            isNewEntry: new FormControl({ value: true, disabled: false })
            }));
        }
        return result;
    }
}

export class TaiwanClientFormGroup extends BaseDefinitionClientFormGroup implements IDefineFormGroup {
    tenantCode: string = "TW";
    define(_formBuilder: FormBuilder, isEdit = false , addDefaultContact =false ,controlId=""): FormGroup {

        const commonDefControls = this.commonDef(_formBuilder, isEdit,addDefaultContact,controlId);

        const result = _formBuilder.group({
            ...commonDefControls.controls,
            invoiceTitle : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            invoiceNumber : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            mandatoryAutoBilling : new FormControl({ value: true, disabled: false }, [Validators.required]),
            statusSubscriptionEnabled : new FormControl({value : false, disabled: false }),
            statusProviderId : new FormControl({ value: '', disabled: false }, [Validators.required,Validators.minLength(0),Validators.maxLength(7), Validators.pattern("^[0-9]*$")]),
          
        });

   
        return result;
    }
}

export class IndiaClientFormGroup extends BaseDefinitionClientFormGroup implements IDefineFormGroup {
    tenantCode: string = "IN";
    define(_formBuilder: FormBuilder, isEdit = false, addDefaultContact =false,controlId=""): FormGroup {

        const commonDefControls = this.commonDef(_formBuilder, isEdit,addDefaultContact,controlId);

        const result = _formBuilder.group({
            ...commonDefControls.controls,
            invoiceTitle : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            invoiceNumber : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            
            emailSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            emailSenderAddress : new FormControl({ value: '', disabled: false }, [Validators.email,Validators.maxLength(255)]),
            emailProviderCode : new FormControl({ value: '', disabled: false }, []),
            smsSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            smsProviderCode : new FormControl({ value: '', disabled: false }, []),
            smsEntityId : new FormControl({ value: '', disabled: false }, []),

            logoMediaId : new FormControl({ value: '', disabled: false }, []),
            bannerMediaId : new FormControl({ value: '', disabled: false }, []),
            subURL : new FormControl({ value: '', disabled: false }, [Validators.maxLength(6)]),
        });

        return result;
    }
}

export class GLClientFormGroup extends BaseDefinitionClientFormGroup implements IDefineFormGroup {
    tenantCode: string = "GL";
    define(_formBuilder: FormBuilder, isEdit = false,addDefaultContact =false,controlId=""): FormGroup {

        const commonDefControls = this.commonDef(_formBuilder, isEdit,addDefaultContact,controlId);

        const result = _formBuilder.group({
            ...commonDefControls.controls,
            
            voucherIssuer : new FormControl({ value: '', disabled: false }, [Validators.required]),

            emailSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            emailSenderAddress : new FormControl({ value: '', disabled: false }, [Validators.email,Validators.maxLength(255)]),
            
            smsSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            

            logoMediaId : new FormControl({ value: '', disabled: false }, []),
            bannerMediaId : new FormControl({ value: '', disabled: false }, []),
            subURL : new FormControl({ value: '', disabled: false }, [Validators.maxLength(6)]),
        });

        return result;
    }
}

export class GRClientFormGroup extends BaseDefinitionClientFormGroup implements IDefineFormGroup {
    tenantCode: string = "GR";
    define(_formBuilder: FormBuilder, isEdit = false,addDefaultContact =false,controlId=""): FormGroup {

        const commonDefControls = this.commonDef(_formBuilder, isEdit,addDefaultContact,controlId);

        const result = _formBuilder.group({
            ...commonDefControls.controls,            
            emailSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            emailSenderAddress : new FormControl({ value: '', disabled: false }, [Validators.email,Validators.maxLength(255)]),            
            smsSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),            
            logoMediaId : new FormControl({ value: '', disabled: false }, []),
            bannerMediaId : new FormControl({ value: '', disabled: false }, []),
            subURL : new FormControl({ value: '', disabled: false }, [Validators.maxLength(6)]),
        });

        return result;
    }
}

export class SingaporeClientFormGroup extends BaseDefinitionClientFormGroup implements IDefineFormGroup {
    tenantCode: string = "SG";
    define(_formBuilder: FormBuilder, isEdit = false,addDefaultContact =false,controlId=""): FormGroup {

        const commonDefControls = this.commonDef(_formBuilder, isEdit,addDefaultContact,controlId);

        const result = _formBuilder.group({
            ...commonDefControls.controls,
            emailSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
            emailSenderAddress : new FormControl({ value: '', disabled: false }, [Validators.email,Validators.maxLength(255)]),            
            smsSenderName : new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),            
            logoMediaId : new FormControl({ value: '', disabled: false }, []),
            bannerMediaId : new FormControl({ value: '', disabled: false }, []),
            subURL : new FormControl({ value: '', disabled: false }, [Validators.maxLength(6)]),
        });

        return result;
    }
}
