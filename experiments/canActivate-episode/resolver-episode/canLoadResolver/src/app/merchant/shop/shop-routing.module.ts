import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';

const routes: Routes = 
[
  { 
    path: '', 
    component: ShopComponent,
    children: [
      { path: 'onstore', loadChildren: () => import('./shop-on-store/shop-on-store.module').then(m => m.ShopOnStoreModule) }, 
      { path: 'online', loadChildren: () => import('./shop-on-line/shop-on-line.module').then(m => m.ShopOnLineModule) }
    ] 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
