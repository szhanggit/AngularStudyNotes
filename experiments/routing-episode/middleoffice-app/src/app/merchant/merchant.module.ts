import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { CreatemerchantComponent } from './createmerchant/createmerchant.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
  declarations: [
    MerchantComponent,
    CreatemerchantComponent,
    DobatchtransactionComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
