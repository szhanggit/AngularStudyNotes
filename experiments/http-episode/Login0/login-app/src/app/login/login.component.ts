import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// auth service
import { AuthenticationService } from './auth.service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthenticationService]
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string = '/';

  loginForm!: FormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  showPassword: boolean = false;

  today: number = Date.now();

  constructor(
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

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = "/landing";
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
      this.authenticationService.login("steven.zhang@Edenred.com", "1234")
        /*.pipe(first())
        .subscribe(
          (data: User) => {
            console.log("login.component.ts ==> " + data);
            console.log("this.returnUrl ==> " + this.returnUrl);
            this.router.navigate([this.returnUrl]);
          },
          (error: string) => {
            this.error = error;
            this.loading = false;
          });*/
          .subscribe({
            next: data => {
              console.log("Data: " + JSON.stringify(data));
              if(data.token)
              {
                console.log("returnUrl: " + this.returnUrl);
                this.router.navigate([this.returnUrl]);
              }
            },
            error: e => console.log(e),
            complete: ()=>{
              console.log('Completed!');
            }              
          });
    }
   }

}
