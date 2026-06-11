import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { ShopComponent } from './shop/shop.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { CreatemerchantComponent } from './createmerchant/createmerchant.component';


@NgModule({
  declarations: [
    MerchantComponent,
    ShopComponent,
    DobatchtransactionComponent,
    CreatemerchantComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
