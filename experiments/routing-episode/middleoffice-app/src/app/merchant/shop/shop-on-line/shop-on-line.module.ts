import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopOnLineRoutingModule } from './shop-on-line-routing.module';
import { ShopOnLineComponent } from './shop-on-line.component';


@NgModule({
  declarations: [
    ShopOnLineComponent
  ],
  imports: [
    CommonModule,
    ShopOnLineRoutingModule
  ]
})
export class ShopOnLineModule { }
