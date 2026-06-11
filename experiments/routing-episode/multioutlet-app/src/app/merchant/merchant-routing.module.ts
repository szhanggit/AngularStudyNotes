import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { CreatemerchantComponent } from './createmerchant/createmerchant.component';
import { DobatchtransactionComponent } from './dobatchtransaction/dobatchtransaction.component';
import { ShopComponent } from './shop/shop.component';

let routing = RouterModule.forChild([
  { 
    path: '', 
    component: MerchantComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', component: CreatemerchantComponent, outlet: "primary" },
          { path: '', component: DobatchtransactionComponent, outlet: "left" },
          { path: '', component: ShopComponent, outlet: "right" }
        ]
      },
      {
        path: 'swap',
        children: [
          { path: '', component: CreatemerchantComponent, outlet: 'left' },
          { path: '', component: DobatchtransactionComponent, outlet: 'right'  },
          { path: '', component: ShopComponent, outlet: 'primary' },
        ]        
      }
    ] 
  }  
]); 



@NgModule({
  imports: [CommonModule, routing],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
