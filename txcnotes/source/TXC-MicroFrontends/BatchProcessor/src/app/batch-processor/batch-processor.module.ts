import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { BatchProcessorRoutingModule } from './batch-processor-routing.module';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import { SharedModule } from './shared/shared.module';
import { ActionModalComponent } from './components/action-modal/action-modal.component';
import { ImportVoucherNumberModalComponent } from './components/inventory-list/import-voucher-number-modal/import-voucher-number-modal.component';
import { DownloadTemplateModalComponent } from './components/inventory-list/download-template-modal/download-template-modal.component';
import { VoucherOperationsListComponent } from './components/voucher-operations-list/voucher-operations-list.component';
import { BatchErrorComponent } from './shared/batch-error/batch-error.component';
import { UploadBatchComponent } from './shared/batch-error/upload-batch/upload-batch.component';
import { UploadBatchOperationsModalComponent } from './components/voucher-operations-list/upload-batch-operations-modal/upload-batch-operations-modal.component';
import { BatchOrderListComponent } from './components/batch-order-list/batch-order-list.component';
import { BatchViewComponent } from './components/batch-order-list/batch-view/batch-view.component';
import { BatchItemViewComponent } from './components/batch-order-list/batch-item-view/batch-item-view.component';
import { CreateBatchOrderModalComponent } from './components/batch-order-list/create-batch-order-modal/create-batch-order-modal.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    ActionModalComponent,
    ImportVoucherNumberModalComponent,
    DownloadTemplateModalComponent,
    VoucherOperationsListComponent,
    BatchErrorComponent,
    UploadBatchComponent,
    BatchOrderListComponent,
    BatchViewComponent,
    BatchItemViewComponent,
    UploadBatchOperationsModalComponent,
    CreateBatchOrderModalComponent,
  ],
  imports: [
    CommonModule,
    BatchProcessorRoutingModule,
    ComponentLibraryModule,
    SharedModule,
  ],
})
export class BatchProcessorModule {}
