import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DobatchtransactionRoutingModule } from './dobatchtransaction-routing.module';
import { DobatchtransactionComponent } from './dobatchtransaction.component';


@NgModule({
  declarations: [
    DobatchtransactionComponent
  ],
  imports: [
    CommonModule,
    DobatchtransactionRoutingModule
  ]
})
export class DobatchtransactionModule { }
