import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsportalRoutingModule } from './csportal-routing.module';
import { CsportalComponent } from './csportal.component';


@NgModule({
  declarations: [
    CsportalComponent
  ],
  imports: [
    CommonModule,
    CsportalRoutingModule
  ]
})
export class CsportalModule { }
