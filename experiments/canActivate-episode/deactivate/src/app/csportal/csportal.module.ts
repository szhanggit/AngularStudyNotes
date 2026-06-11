import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsportalRoutingModule } from './csportal-routing.module';
import { CsportalComponent } from './csportal.component';
//import { MessageService } from '../message/message.service';

@NgModule({
  declarations: [
    CsportalComponent
  ],
  imports: [
    CommonModule,
    CsportalRoutingModule
  ],
  providers: []
})
export class CsportalModule { }
