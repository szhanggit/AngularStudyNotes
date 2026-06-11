import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'shops', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) }, 
  { path: 'dobatchtransaction', loadChildren: () => import('./dobatchtransaction/dobatchtransaction.module').then(m => m.DobatchtransactionModule) }, 
  { path: 'createmerchant', loadChildren: () => import('./createmerchant/createmerchant.module').then(m => m.CreatemerchantModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
