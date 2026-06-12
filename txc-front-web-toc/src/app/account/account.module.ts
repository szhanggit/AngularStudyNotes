import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { Account2Component } from './account2/account2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from '../shared/widget/widget.module';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password1/confirm-password.component';
import { ConfirmPassword2Component } from './confirm-password/confirm-password2/confirm-password2.component';
import { LockScreenComponent } from './lock-screen/lock-screen/lock-screen.component';
import { LockScreen2Component } from './lock-screen/lock-screen2/lock-screen2.component';
import { LoginComponent } from './login/login1/login.component';
import { Login2Component } from './login/login2/login2.component';
import { LogoutComponent } from './logout/logout1/logout.component';
import { Logout2Component } from './logout/logout2/logout2.component';
import { PasswordResetComponent } from './password-reset/password-reset1/password-reset.component';
import { PasswordReset2Component } from './password-reset/password-reset2/password-reset2.component';
import { SignupComponent } from './signup/signup1/signup.component';
import { Signup2Component } from './signup/signup2/signup2.component';



@NgModule({
  declarations: [
    Account2Component,
    LoginComponent,
    SignupComponent,
    Login2Component,
    Signup2Component,
    ConfirmPasswordComponent,
    ConfirmPassword2Component,
    PasswordResetComponent,
    PasswordReset2Component,
    LogoutComponent,
    Logout2Component,
    LockScreenComponent,
    LockScreen2Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    WidgetModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
