import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { ShopComponent } from './shop/shop.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { CreatemerchantComponent } from './createmerchant/createmerchant.component';


const routes: Routes = [
  {
    path: '', //Can be empty.
    component: MerchantComponent, //No matter which component below is selected, this component MerchantComponent will not disappear.
    children: [
      //{ path: '', component: MerchantComponent }, //This component MerchantComponent could disappear once other options are selected.
      { path: 'shops', component: ShopComponent }, 
      { path: 'dobatchtransaction', component: DobatchtransactionComponent }, 
      { path: 'createmerchant', component: CreatemerchantComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
