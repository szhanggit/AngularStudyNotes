import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadGuard } from "./load.guard";

const routes: Routes = [
  { path: 'orders', loadChildren: () => import('./order/order.module').then(m => m.OrderModule), canLoad: [LoadGuard] }, 
  { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule), canLoad: [LoadGuard] }, 
  { path: 'clients', loadChildren: () => import('./client/client.module').then(m => m.ClientModule), canLoad: [LoadGuard] }, 
  { path: 'csportal', loadChildren: () => import('./csportal/csportal.module').then(m => m.CsportalModule), canLoad: [LoadGuard] }, 
  { path: 'merchants', loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule), canLoad: [LoadGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
