import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';

const routes: Routes = [
  { 
    path: '', 
    component: MerchantComponent,
    children: [
      { path: 'shops', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) }, 
      { path: 'dobatchtransaction', loadChildren: () => import('./dobatchtransaction/dobatchtransaction.module').then(m => m.DobatchtransactionModule) }, 
      { path: 'createmerchant', loadChildren: () => import('./createmerchant/createmerchant.module').then(m => m.CreatemerchantModule) }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
