import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { VoucherOperationsListComponent } from './components/voucher-operations-list/voucher-operations-list.component';
import { BatchOrderListComponent } from './components/batch-order-list/batch-order-list.component';

const routes: Routes = [
  { path: 'voucher/inventory-list', component: InventoryListComponent }, 
  { path: 'voucher/voucher-operations-list', component: VoucherOperationsListComponent},
  { path: 'order/batch-order-list', component: BatchOrderListComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchProcessorRoutingModule { }