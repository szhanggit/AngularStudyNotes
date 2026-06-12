import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/core/models/auth.models';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.component.html',
  styleUrls: ['./signup2.component.scss']
})
export class Signup2Component implements OnInit {

  signUpForm2!: FormGroup;
  formSubmitted: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.signUpForm2 = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm2.controls;
  }


  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.signUpForm2.valid) {
      this.loading = true;
      this.authenticationService.signup(this.formValues.name?.value, this.formValues.email?.value, this.formValues.password?.value)
        .pipe(first())
        .subscribe(
          (data: User) => {
            // navigates to confirm mail screen
            this.router.navigate(['/account/confirm2']);
          },
          (error: string) => {
            this.error = error;
            this.loading = false;
          });
    }
  }

}
