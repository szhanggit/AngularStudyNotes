import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherRoutingModule } from './voucher-routing.module';
import { BatchDetailComponent } from './components/batch-detail/batch-detail.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-overviw/inventory-dashboard.component';
import { InventorySkuDetailsComponent } from './components/inventory-dashboard/inventory-sku-details/inventory-sku-details.component';
import { DownloadVoucherImportTemplateComponent } from './components/inventory-dashboard/download-voucher-import-template/download-voucher-import-template.component';
import { ImportVoucherNoComponent } from './components/inventory-dashboard/import-voucher-no/import-voucher-no.component';
import { UploadVoucherImportFileComponent } from './components/inventory-dashboard/upload-voucher-import-file/upload-voucher-import-file.component';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import { SimplebarAngularModule } from 'simplebar-angular';
import { InventoryBatchDetailsComponent } from './components/inventory-batch-details/inventory-batch-details.component';
import { VoucherListComponent } from './components/voucher-list/voucher-list.component';
import { VoucherDetailsComponent } from './components/voucher-details/voucher-details.component';
import { MaskWithStarPipe } from './pipe/mask-with-star.pipe';
import { VoucherStatusTagComponent } from './components/voucher-status-tag/voucher-status-tag.component';
import { VoucherHistoryComponent } from './components/voucher-history/voucher-history.component';
import { OperationHistoryComponent } from './components/operation-history/operation-history.component';
import { ProductTypePipe } from './pipe/product-type.pipe';


@NgModule({
  declarations: [
    BatchDetailComponent,
    InventoryDashboardComponent,
    DownloadVoucherImportTemplateComponent,
    ImportVoucherNoComponent,
    UploadVoucherImportFileComponent,
    InventorySkuDetailsComponent,
    InventoryBatchDetailsComponent,
    VoucherListComponent,
    VoucherDetailsComponent,
    MaskWithStarPipe,
    VoucherStatusTagComponent,
    VoucherHistoryComponent,
    OperationHistoryComponent,
    ProductTypePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VoucherRoutingModule,
    NgbModule,
    NgxDropzoneModule,
    NgbTypeaheadModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    SimplebarAngularModule,
    ComponentLibraryModule,
    SharedModule,
  ],
  providers: [
    InventoryDashboardComponent,
  ]
})
export class VoucherModule { }
