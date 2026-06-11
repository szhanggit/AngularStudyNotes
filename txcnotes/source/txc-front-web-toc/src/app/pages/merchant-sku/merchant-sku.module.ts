import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantSkuRoutingModule } from './merchant-sku-routing.module';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { DetailComponent } from './detail/detail.component';
import { EditMerchantSkuNameComponent } from './detail/model/edit-merchant-sku-name/edit-merchant-sku-name.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditAdditionalInfoComponent } from './detail/model/edit-additional-info/edit-additional-info.component';
import { EditVoucherWatermarkRuleComponent } from './detail/model/edit-voucher-watermark-rule/edit-voucher-watermark-rule.component';
import { ViewAllRelatedProductCodeComponent } from './detail/model/view-all-related-product-code/view-all-related-product-code.component';
import { DownloadRemainingVoucherDetailsComponent } from './detail/model/download-remaining-voucher-details/download-remaining-voucher-details.component';
import { EditDateInfoComponent } from './detail/model/edit-date-info/edit-date-info.component';
import { ViewDownloadHistoryComponent } from './detail/model/view-download-history/view-download-history.component';
import { ViewInventoryDetailsComponent } from './detail/model/view-inventory-details/view-inventory-details.component';


@NgModule({
  declarations: [
    CreateComponent,
    DetailComponent,
    EditMerchantSkuNameComponent,
    EditAdditionalInfoComponent,
    EditVoucherWatermarkRuleComponent,
    ViewAllRelatedProductCodeComponent,
    DownloadRemainingVoucherDetailsComponent,
    EditDateInfoComponent,
    ViewDownloadHistoryComponent,
    ViewInventoryDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MerchantSkuRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule,
    Select2Module,
    NgbModule,
  ],
  providers: [
    NgbActiveModal,
  ]
})
export class MerchantSkuModule { }
