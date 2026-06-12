import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchDetailComponent } from './components/batch-detail/batch-detail.component';
import { InventorySkuDetailsComponent } from './components/inventory-dashboard/inventory-sku-details/inventory-sku-details.component';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-overviw/inventory-dashboard.component';
import { InventoryBatchDetailsComponent } from './components/inventory-batch-details/inventory-batch-details.component';
import { VoucherListComponent } from './components/voucher-list/voucher-list.component';
import { VoucherDetailsComponent } from './components/voucher-details/voucher-details.component';
import { PageAuthorizationGuard } from '@txc-angular/authorization-library';
import { VoucherHistoryComponent } from './components/voucher-history/voucher-history.component';



const routes: Routes = [
  // Voucher
  {
    path: '',
    component: VoucherListComponent,
    // canActivate: [PageAuthorizationGuard]
    
  },
  {
    path: 'voucher-list',
    component: VoucherListComponent,
    // canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'voucher-details/:id',
    component: VoucherDetailsComponent,
    // canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'voucher-history/:id',
    component: VoucherHistoryComponent,
    // canActivate: [PageAuthorizationGuard]
  },

  // Inventory
  {
    path: 'inventory/overview',
    component: InventoryDashboardComponent,
    // canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'inventory/sku-details/:id',
    component: InventorySkuDetailsComponent,
    // canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'inventory/inventory-batch-details/:id',
    component: InventoryBatchDetailsComponent,
    // canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'batch-detail',
    component: BatchDetailComponent,
    // canActivate: [PageAuthorizationGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherRoutingModule { }
