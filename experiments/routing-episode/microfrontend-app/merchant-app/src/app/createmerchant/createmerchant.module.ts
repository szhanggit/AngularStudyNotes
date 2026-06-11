import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatemerchantRoutingModule } from './createmerchant-routing.module';
import { CreatemerchantComponent } from './createmerchant.component';


@NgModule({
  declarations: [
    CreatemerchantComponent
  ],
  imports: [
    CommonModule,
    CreatemerchantRoutingModule
  ]
})
export class CreatemerchantModule { }
