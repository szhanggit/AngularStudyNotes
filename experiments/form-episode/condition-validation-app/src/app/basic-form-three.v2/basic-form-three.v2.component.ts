import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-form-three.v2',
  templateUrl: './basic-form-three.v2.component.html',
  styleUrls: ['./basic-form-three.v2.component.css']
})
export class BasicFormThreeV2Component implements OnInit {
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
        this.requiredIfValidator(() => this.myForm.get('myCheckbox')?.value) 
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

  requiredIfValidator(predicate: ()=> boolean) {
    return ((formControl: AbstractControl) => {
      if (!formControl.parent) {
        return null;
      }
      if (predicate()) {
        return Validators.required(formControl); 
      }
      return null;
    })
  }

}
