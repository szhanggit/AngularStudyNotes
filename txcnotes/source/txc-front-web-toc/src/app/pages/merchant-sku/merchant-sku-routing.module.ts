import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ViewInventoryDetailsComponent } from './detail/model/view-inventory-details/view-inventory-details.component';

const routes: Routes = [
  { path: "", redirectTo: "create" },
  { path: "create", component: CreateComponent },
  { path: "detail", component: DetailComponent },
  { path: "view-inventory-details", component: ViewInventoryDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantSkuRoutingModule { }
