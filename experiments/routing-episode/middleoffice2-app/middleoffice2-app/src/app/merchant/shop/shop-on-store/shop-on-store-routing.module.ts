import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopOnStoreComponent } from './shop-on-store.component';

const routes: Routes = [{ path: '', component: ShopOnStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopOnStoreRoutingModule { }
