import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FutureDateValidator } from 'src/app/core/validators/future-date-validator';

@Injectable({
  providedIn: 'root'
})
export class InitializeTenantFormGroupService {

  constructor(private fb: FormBuilder) { }

  initialize(callbackFunction:any, editMode: boolean){
    let formGroup = this.fb.group({
      tenantBasicInfoId: new FormControl({value: ''}), 
      name: new FormControl({value: '', disabled: editMode},[Validators.required]),
      countryCode: new FormControl({value:'', disabled: editMode},[Validators.required]),
      timezone: new FormControl({value:'', disabled: editMode},[Validators.required]),
      timeFormat: new FormControl({value:'', disabled: editMode},[Validators.required]),
      currencySymbol: new FormControl({value:'', disabled: editMode},[Validators.required]),
      companyTaxType: new FormControl({value:'', disabled: false},[Validators.required]),
      companyTaxRate: new FormControl({value:'', disabled: false},[Validators.required]),
      effectivityDate: new FormControl({value:'', disabled: editMode},[Validators.required, FutureDateValidator.futureDateValidator]),
      language: new FormControl({value:'', disabled: false},[Validators.required]),
      logo: new FormControl({value:'', disabled: false})
    });

    callbackFunction(formGroup);
  }
}
