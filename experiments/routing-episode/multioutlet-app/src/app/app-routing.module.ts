import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'orders', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) }, { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) }, { path: 'clients', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) }, { path: 'csportal', loadChildren: () => import('./csportal/csportal.module').then(m => m.CsportalModule) }, { path: 'merchants', loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
