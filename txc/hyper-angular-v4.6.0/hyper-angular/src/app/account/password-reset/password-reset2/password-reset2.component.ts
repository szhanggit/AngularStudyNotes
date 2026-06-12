import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset2',
  templateUrl: './password-reset2.component.html',
  styleUrls: ['./password-reset2.component.scss']
})
export class PasswordReset2Component implements OnInit {

  resetPassswordForm2!: FormGroup;
  formSubmitted: boolean = false;
  successMessage: string = "";


  constructor (private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resetPassswordForm2 = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg');
  }


  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.resetPassswordForm2.controls;
  }


  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.resetPassswordForm2.valid) {
      this.successMessage = "We have sent you an email containing a link to reset your password";
    }
  }

}
