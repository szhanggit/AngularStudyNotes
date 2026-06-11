import { NgModule } from '@angular/core';
//import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { MerchantComponent } from './merchant/merchant.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { CreatemerchantsComponent } from './createmerchants/createmerchants.component';
import { ShopComponent } from './shop/shop.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    MerchantComponent,
    DobatchtransactionComponent,
    CreatemerchantsComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    //RouterModule,
  ]
})
export class MerchantModule { }
