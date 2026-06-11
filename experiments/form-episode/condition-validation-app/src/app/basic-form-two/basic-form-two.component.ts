import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-form-two',
  templateUrl: './basic-form-two.component.html',
  styleUrls: ['./basic-form-two.component.css']
})
export class BasicFormTwoComponent implements OnInit {
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
         Validators.pattern(/.+@.+\..+/)
      ]]
    }, {
      validators: [this.emailConditionallyRequiredValidator] // <-----
    });
  }

  ngOnInit(): void {
  }

  emailConditionallyRequiredValidator(formGroup: FormGroup) {
    if (formGroup.value.myCheckbox) {
      var emailField = formGroup.get('myEmailField') as AbstractControl;
      return Validators.required(emailField) ? {myEmailFieldConditionallyRequired: true} : null;
    }
    return null;
  }

  onSubmit() {
    console.log(this.f.myEmailField.errors);
    if (this.myForm.valid) {		
      console.log(this.myForm.value);
    }else{
      console.log(`Failed to validate.`);
    }    
  }

}
