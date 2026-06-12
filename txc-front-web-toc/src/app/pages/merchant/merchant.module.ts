import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { MerchantRoutingModule } from './merchant-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MerchantService } from './services/merchant.service';
import { SecurityKeyService } from './services/security-key.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateMerchantComponent } from './components/create-merchant/create-merchant.component';
import { MerchantDetailsComponent } from './components/merchant-details/merchant-details.component';
import { UpdateMerchantComponent } from './components/update-merchant/update-merchant.component';
import { ShopListComponent } from './components/shops/shop-list/shop-list.component';
import { AutoCreateReimbursementPipe } from './pipes/auto-create-reimbursement-tax-type.pipe';
import { AutoCreateReimbursementDayPipe } from './pipes/auto-create-reimbursement-day.pipe';
import { IsLegacyMerchantPipe } from './pipes/is-legacy-merchant.pipe';
import { IssuerTypePipe } from './pipes/issuer-type.pipe';
import { MerchantAutoTypePipe } from './pipes/merchant-auto-type.pipe';
import { ReimbursementTaxTypePipe } from './pipes/reimbursement-tax-type.pipe';
import { ReimbursementTypePipe } from './pipes/reimbursement-type.pipe';
import { ShopCreateComponent } from './components/shops/shop-create/shop-create.component';
import { ShopEditComponent } from './components/shops/shop-edit/shop-edit.component';
import { ShopBatchUploadComponent } from './components/shops/shop-batch-upload/shop-batch-upload.component';
import { ContractListComponent } from './components/contract/contract-list/contract-list.component';
import { ContractService } from './services/contract.service';
import { ContractCreateComponent } from './components/contract/contract-create/contract-create.component';

@NgModule({
  declarations: [
    MerchantListComponent,
    CreateMerchantComponent,
    MerchantDetailsComponent,
    UpdateMerchantComponent,
    AutoCreateReimbursementPipe,
    AutoCreateReimbursementDayPipe,
    IsLegacyMerchantPipe,
    IssuerTypePipe,
    MerchantAutoTypePipe,
    ReimbursementTaxTypePipe,
    ReimbursementTypePipe,
    ShopListComponent,
    ShopCreateComponent,
    ShopEditComponent,
    ShopBatchUploadComponent,
    ContractListComponent,
    ContractCreateComponent
  ],
  imports: [
    MerchantRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule
  ],
  providers: [
    MerchantService,
    SecurityKeyService,
    ContractService
  ]
})
export class MerchantModule { }
