import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultFirstGuard } from './defaultFirst.guard';

const routes: Routes = [
  { path: 'orders', loadChildren: () => import('./order/order.module').then(m => m.OrderModule), canActivate: [DefaultFirstGuard] }, 
  { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule), canActivate: [DefaultFirstGuard] }, 
  { path: 'clients', loadChildren: () => import('./client/client.module').then(m => m.ClientModule), canActivate: [DefaultFirstGuard] }, 
  { path: 'csportal', loadChildren: () => import('./csportal/csportal.module').then(m => m.CsportalModule), canActivate: [DefaultFirstGuard] }, 
  { path: 'merchants', loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule), canActivate: [DefaultFirstGuard] },
  { path: "**", redirectTo: "/clients" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [DefaultFirstGuard],
})
export class AppRoutingModule { 
  constructor(){
    console.log("Reloaded!!!");
  }
}
