import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MerchantComponent } from './merchant/merchant.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { ClientComponent } from './client/client.component';
import { CsportalComponent } from './csportal/csportal.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { CreatemerchantsComponent } from './createmerchants/createmerchants.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
  declarations: [
    AppComponent,
    MerchantComponent,
    OrderComponent,
    ProductComponent,
    ClientComponent,
    CsportalComponent,
    DobatchtransactionComponent,
    CreatemerchantsComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
