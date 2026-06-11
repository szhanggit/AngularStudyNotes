import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-form-one',
  templateUrl: './basic-form-one.component.html',
  styleUrls: ['./basic-form-one.component.css']
})
export class BasicFormOneComponent implements OnInit {
  myForm: FormGroup;
  formSubmitted: boolean = false;
  get f(): any {
    return this.myForm.controls;
  }

  private emailValidators = [
    Validators.maxLength(250),
    Validators.minLength(5),
    Validators.pattern(/.+@.+\..+/)
  ];

  constructor(private readonly _formBuilder: FormBuilder) { 
    this.myForm = this._formBuilder.group({
      myCheckbox: [''],
      myEmailField: ['', this.emailValidators]
    });
  }

  ngOnInit(): void {
    this.myForm.get('myCheckbox')?.valueChanges.subscribe(value => {
        if(value) {          
          this.myForm.get('myEmailField')?.setValidators(this.emailValidators.concat(Validators.required));
          console.log("True");
        } else {
          this.myForm.get('myEmailField')?.setValidators(this.emailValidators);
          console.log("False");
        }

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

}
