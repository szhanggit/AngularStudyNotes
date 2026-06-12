import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'confirm',
    component: ConfirmPasswordComponent
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent
  },
  {
    path: 'login2',
    component: Login2Component
  },
  {
    path: 'signup2',
    component: Signup2Component
  },
  {
    path: 'confirm2',
    component: ConfirmPassword2Component
  },
  {
    path: 'reset-password2',
    component: PasswordReset2Component
  },
  {
    path: 'logout2',
    component: Logout2Component
  },
  {
    path: 'lock-screen2',
    component: LockScreen2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
