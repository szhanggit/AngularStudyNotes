import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenRefresherComponent } from './components/token-refresher/token-refresher.component';
import { Error401Component } from './components/errors/error401/error401.component';
import { Error403Component } from './components/errors/error403/error403.component';
import { Error404Component } from './components/errors/error404/error404.component';



@NgModule({
  declarations: [
    TokenRefresherComponent,
    Error401Component,
    Error403Component,
    Error404Component
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TokenRefresherComponent
  ]
})
export class SecurityModule { }
