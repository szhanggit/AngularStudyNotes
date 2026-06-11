import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantSkuComponent } from './merchant-sku.component';

import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  { path: '', component: MerchantSkuComponent },
  { path: "create", component: CreateComponent },
  { path: "detail", component: DetailComponent },
  { path: "service", component: ServicesComponent }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantSkuRoutingModule { }
