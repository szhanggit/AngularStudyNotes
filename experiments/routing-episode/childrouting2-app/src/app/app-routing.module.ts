import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { MerchantModule } from './merchant/merchant.module';  //If it is disabled, will show that 'router-outlet' cannot be recognized.

import { ClientComponent } from './client/client/client.component';
import { CsportalComponent } from './csportal/csportal/csportal.component';
import { OrderComponent } from './order/order/order.component';
import { ProductComponent } from './product/product/product.component';
import { MerchantComponent } from './merchant/merchant/merchant.component';

import { CreatemerchantsComponent } from './merchant/createmerchants/createmerchants.component';
import { ShopComponent } from './merchant/shop/shop.component';
import { DobatchtransactionComponent } from './merchant/dobatchtransaction/dobatchtransaction.component';

/*
const routes: Routes = [
  {
    path:'clients', component: ClientComponent
  },
  {
    path:'csportal', component: CsportalComponent
  },
  {
    path:'orders', component: OrderComponent
  },
  {
    path:'products', component: ProductComponent
  },         
  {
    path:'merchants', 
    component: MerchantComponent,
    children: [
      { path:'createmerchants', component: CreatemerchantsComponent },
      { path:'shop', component: ShopComponent },
      { path:'dobatchtransaction', component: DobatchtransactionComponent }
    ]
  },
];
*/

const childRoutes_1: Routes = [
  { path: "", /*
    path: ""  =>  http://localhost:4200/merchants/shop
    path: "s" =>  http://localhost:4200/merchants/s/shop
  */
    children: [
      { path:'createmerchants', component: CreatemerchantsComponent },
      { path:'shop', component: ShopComponent },
      { path:'dobatchtransaction', component: DobatchtransactionComponent }
    ]
  }
];


const routes: Routes = [
  {
    path:'clients', component: ClientComponent
  },
  {
    path:'csportal', component: CsportalComponent
  },
  {
    path:'orders', component: OrderComponent
  },
  {
    path:'products', component: ProductComponent
  },         
  {
    path:'merchants', 
    component: MerchantComponent,
    children: childRoutes_1
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
