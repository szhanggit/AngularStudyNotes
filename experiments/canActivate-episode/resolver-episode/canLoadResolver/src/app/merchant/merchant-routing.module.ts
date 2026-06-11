import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { LoadGuard } from "../load.guard";

const routes: Routes = [
  { 
    path: '', 
    component: MerchantComponent,
    children: [
      { path: 'shops', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule), canLoad: [LoadGuard] }, 
      { path: 'dobatchtransaction', loadChildren: () => import('./dobatchtransaction/dobatchtransaction.module').then(m => m.DobatchtransactionModule), canLoad: [LoadGuard] }, 
      { path: 'createmerchant', loadChildren: () => import('./createmerchant/createmerchant.module').then(m => m.CreatemerchantModule), canLoad: [LoadGuard] }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
