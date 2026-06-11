import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
//import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PasswordComponent } from './password/password.component';


@NgModule({
  declarations: [
    //AccountComponent,
    LoginComponent,
    LogoutComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
