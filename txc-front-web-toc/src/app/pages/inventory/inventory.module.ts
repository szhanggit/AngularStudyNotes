import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RejectReasonComponent } from './batch-detail/model/reject-reason/reject-reason.component';
import { BatchDetailComponent } from './batch-detail/batch-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { ImportVoucherNoComponent } from './overview/model/import-voucher-no/import-voucher-no.component';
import { DownloadVoucherImportTemplateComponent } from './overview/model/download-voucher-import-template/download-voucher-import-template/download-voucher-import-template.component';
import { UploadVoucherImportFileComponent } from './overview/model/upload-voucher-import-file/upload-voucher-import-file.component';
import { SetCostForMerchantSkuComponent } from './set-cost-for-merchant-sku/set-cost-for-merchant-sku.component';
import { ViewDownloadHistoryComponent } from './approval-list/model/view-download-history/view-download-history.component';

@NgModule({
  declarations: [
    ApprovalListComponent,
    BatchDetailComponent,
    RejectReasonComponent,
    OverviewComponent,
    ImportVoucherNoComponent,
    DownloadVoucherImportTemplateComponent,
    UploadVoucherImportFileComponent,
    SetCostForMerchantSkuComponent,
    ViewDownloadHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
    NgbModule
  ]
})
export class InventoryModule { }
