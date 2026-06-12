import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {


  resetPassswordForm!: FormGroup;
  formSubmitted: boolean = false;
  successMessage: string = "";

  today: number = Date.now();

  constructor (private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resetPassswordForm = this.fb.group({
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
    return this.resetPassswordForm.controls;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.resetPassswordForm.valid) {
      this.successMessage = "We have sent you an email containing a link to reset your password";
    }
  }

}
