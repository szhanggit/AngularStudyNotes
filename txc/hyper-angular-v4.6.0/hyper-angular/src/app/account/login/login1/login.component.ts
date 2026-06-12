import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

// types
import { User } from 'src/app/core/models/auth.models';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string = '/';

  loginForm!: FormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  showPassword: boolean = false;

  today: number = Date.now();

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['hyper@coderthemes.com', [Validators.required, Validators.email]],
      password: ['test', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg');
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() { return this.loginForm.controls; }

  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
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

