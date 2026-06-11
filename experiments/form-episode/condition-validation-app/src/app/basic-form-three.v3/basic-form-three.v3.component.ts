import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-basic-form-three.v3',
  templateUrl: './basic-form-three.v3.component.html',
  styleUrls: ['./basic-form-three.v3.component.css']
})
export class BasicFormThreeV3Component implements OnInit {
  myForm: FormGroup;
  formSubmitted: boolean = false;
  get f(): any {
    return this.myForm.controls;
  }

  constructor(private readonly _formBuilder: FormBuilder) { 
    this.myForm = this._formBuilder.group({
      myCheckbox: [''],
      myEmailField: ['', [
        Validators.maxLength(250),
        Validators.minLength(5),
        Validators.pattern(/.+@.+\..+/),
        this.conditionalValidator(() => this.myForm.get('myCheckbox')?.value, Validators.required, 'illuminatiError')
     ]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('myCheckbox')?.valueChanges.subscribe(value => {
      this.myForm.get('myEmailField')?.updateValueAndValidity();
    }
  );
  }

  onSubmit() {

    console.log(this.f.myEmailField.errors);
    if (this.myForm.valid) {		
      console.log(this.myForm.value);
    }else{
      console.log(`Failed to validate.`);
    }
    
  }

  conditionalValidator(predicate: ()=> boolean, validator: ValidatorFn, errorNamespace?: string): ValidatorFn {
    return (formControl => {
      if (!formControl.parent) {
        return null;
      }
      let error = null;
      if (predicate()) {
        error = validator(formControl);
      }
      return error;
    })
  }




}
