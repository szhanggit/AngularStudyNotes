import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/core/models/auth.models';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit {


  loginForm2!: FormGroup;
  formSubmitted: boolean = false;
  loading: boolean = false;
  returnUrl: string = '/';
  error: string = '';

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.loginForm2 = this.fb.group({
      email: ['hyper@coderthemes.com', [Validators.required, Validators.email]],
      password: ['test', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() { return this.loginForm2.controls; }


  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm2.valid) {
      this.loading = true;
      this.authenticationService.login(this.formValues.email?.value, this.formValues.password?.value)
        .pipe(first())
        .subscribe(
          (data: User) => {
            this.router.navigate([this.returnUrl]);
          },
          (error: string) => {
            this.error = error;
            this.loading = false;
          });
    }
  }

}
