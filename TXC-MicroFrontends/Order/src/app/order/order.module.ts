import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderRoutingModule } from './order-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { SharedModule } from '../shared/shared.module';
import { ExportDeliveryComponent } from './components/export-delivery/export-delivery.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { QuotationTypeComponent } from './components/create-order/quotation-type/quotation-type.component';
import { OrderWizardComponent } from './components/order-wizard/order-wizard.component';
import { SelectProductComponent } from './components/select-product/select-product.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CloseOrderModalComponent } from './components/order-details/close-order-modal/close-order-modal.component';
import { OrderHistoryComponent } from './components/order-details/order-history/order-history.component';
import { DownloadExcelFileComponent } from './components/order-details/download-excel-file/download-excel-file.component';
import { SendFileComponent } from './components/order-details/send-file/send-file.component';
import { SelectOrderTypeComponent } from './components/create-order/select-order-type/select-order-type.component';
import { DirectDeliveryDetailsComponent } from './components/select-product/direct-delivery-details/direct-delivery-details.component';
import { AddDeliveryDetailsModalComponent } from './components/select-product/direct-delivery-details/add-delivery-details-modal/add-delivery-details-modal.component';
import { OrderModeTypePipe } from './pipes/order-mode-type.pipe';
import { EditDeliveryContentComponent } from './components/edit-delivery-content/edit-delivery-content.component';
import { DirectDeliveryListComponent } from './components/direct-delivery-list/direct-delivery-list.component';
import { SyncStatusHistoryComponent } from './components/order-details/sync-status-history/sync-status-history.component';
import { RemoveTagDirective } from '../shared/directives/remove-tag.directive';

@NgModule({
  declarations: [
    OrderListComponent,
    ExportDeliveryComponent,
    CreateOrderComponent,
    QuotationTypeComponent,
    OrderWizardComponent,
    SelectProductComponent,
    OrderDetailsComponent,
    CloseOrderModalComponent,
    OrderHistoryComponent,
    DownloadExcelFileComponent,
    SendFileComponent,
    SelectOrderTypeComponent,
    DirectDeliveryDetailsComponent,
    AddDeliveryDetailsModalComponent,
    OrderModeTypePipe,
    EditDeliveryContentComponent,
    DirectDeliveryListComponent,
    SyncStatusHistoryComponent,
    RemoveTagDirective,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    Select2Module,
    SharedModule,
  ],
})
export class OrderModule {}
