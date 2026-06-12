import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { BatchDetailComponent } from './batch-detail/batch-detail.component';
import { OverviewComponent } from './overview/overview.component';
import { SetCostForMerchantSkuComponent } from './set-cost-for-merchant-sku/set-cost-for-merchant-sku.component';

const routes: Routes = [
  {path: "", redirectTo  : "overview", pathMatch: 'full'},  
  {path: "overview", component: OverviewComponent},
  {path: "approval-list", component: ApprovalListComponent},
  {path: "batch-detail", component: BatchDetailComponent},
  {path: "set-cost-merchant-sku", component: SetCostForMerchantSkuComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
