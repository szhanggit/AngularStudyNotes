import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { MerchantRoutingModule } from './merchant-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SecurityKeyService } from './services/security-key.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MerchantCreateComponent } from './components/merchant-create/merchant-create.component';
import { MerchantDetailsComponent } from './components/merchant-details/merchant-details.component';
import { MerchantEditComponent } from './components/merchant-edit/merchant-edit.component';
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
import { HttpClientModule } from '@angular/common/http';
import { VoucherNumberRuleListComponent } from './components/voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component';
import { ShopService } from './services/shop.service';
import { VoucherNumberRuleService } from './services/voucher-number-rule.service';
import { VoucherNumberRuleCreateComponent } from './components/voucher-number-rule/voucher-number-rule-create/voucher-number-rule-create.component';
import { VoucherNumberRuleFormComponent } from './components/voucher-number-rule/voucher-number-rule-form/voucher-number-rule-form.component';
import { MerchantFormComponent } from './components/merchant-form/merchant-form.component';
import { ShopFormComponent } from './components/shops/shop-form/shop-form.component';
import { VoucherNumberRuleEditComponent } from './components/voucher-number-rule/voucher-number-rule-edit/voucher-number-rule-edit.component';
import { AcceptanceLoopFormComponent } from './components/acceptance-loop/acceptance-loop-form/acceptance-loop-form.component';
import { AcceptanceLoopCreateComponent } from './components/acceptance-loop/acceptance-loop-create/acceptance-loop-create.component';
import { AcceptanceLoopEditComponent } from './components/acceptance-loop/acceptance-loop-edit/acceptance-loop-edit.component';
import { AcceptanceLoopShopComponent } from './components/acceptance-loop/acceptance-loop-shop/acceptance-loop-shop.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ShopStatusTypePipe } from './pipes/shop-status-type.pipe';
import { MerchantAcceptanceLoopListComponent } from './components/acceptance-loop/merchant-acceptance-loop-list/merchant-acceptance-loop-list.component';
import { VoucherNumberRuleDeleteComponent } from './components/voucher-number-rule/voucher-number-rule-delete/voucher-number-rule-delete.component';
import { ThirdPartyVoucherNumberRuleFormComponent } from './components/voucher-number-rule/third-party-voucher-number-rule-form/third-party-voucher-number-rule-form.component';
import { ContractCreateComponent } from './components/contract/contract-create/contract-create.component';
import { ContractListComponent } from './components/contract/contract-list/contract-list.component';
import { ContractFormComponent } from './components/contract/contract-form/contract-form.component';
import { SKUFormComponent } from './components/sku/sku-form/sku-form.component';
import { SKUCreateComponent } from './components/sku/sku-create/sku-create.component';
import { VoucherNumberRuleDeleteErrorComponent } from './components/voucher-number-rule/voucher-number-rule-delete-error/voucher-number-rule-delete-error.component';
import { MerchantGroupDetailsComponent } from './components/merchant-group/info/merchant-group-details/merchant-group-details.component';
import { MerchantGroupManagementComponent } from './components/merchant-group/info/merchant-group-management/merchant-group-management.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { MerchantGroupSkuManagementComponent } from './components/merchant-group/sku/merchant-group-sku-management/merchant-group-sku-management.component';
import { MerchantGroupSkuViewComponent } from './components/merchant-group/sku/merchant-group-sku-view/merchant-group-sku-view.component';
import { PopupForAddMerchantComponent } from './components/merchant-group/sku/merchant-group-sku-management/popup-for-add-merchant/popup-for-add-merchant.component';
import { ContractDetailsComponent } from './components/contract/contract-details/contract-details.component';
import { MerchantContractListComponent } from './components/contract/merchant-contract-list/merchant-contract-list.component';
import { MerchantGroupAcceptanceLoopShopComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-shop/merchant-group-acceptance-loop-shop.component';
import { MerchantGroupAcceptanceLoopCreateComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-create/merchant-group-acceptance-loop-create.component';
import { MerchantGroupAcceptanceLoopEditComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-edit/merchant-group-acceptance-loop-edit.component';
import { SkuListComponent } from './components/sku/sku-list/sku-list.component';
import { MerchantSkuListComponent } from './components/sku/merchant-sku-list/merchant-sku-list.component';
import { MerchantGroupAcceptanceLoopFormComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-form/merchant-group-acceptance-loop-form.component';
import { MerchantGroupAcceptanceLoopListComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-list/merchant-group-acceptance-loop-list.component';
import { MerchantGroupAcceptanceLoopViewModalComponent } from './components/merchant-group/acceptance-loop/merchant-group-acceptance-loop-view-modal/merchant-group-acceptance-loop-view-modal.component';
import { MerchantGroupMerchantMapComponent } from './components/merchant-group/info/merchant-group-merchant-map/merchant-group-merchant-map.component';
import { SkuEditComponent } from './components/sku/sku-edit/sku-edit.component';
import { AcceptanceLoopListComponent } from './components/acceptance-loop/acceptance-loop-list/acceptance-loop-list.component';
import { MerchantGroupSkuDetailsComponent } from './components/merchant-group/sku/merchant-group-sku-details/merchant-group-sku-details.component';
import { ContractModalEditPeriodComponent } from './components/contract/contract-modal-edit-period/contract-modal-edit-period.component';
import { ContractEditComponent } from './components/contract/contract-edit/contract-edit.component';
import { ContractModalAddSkuComponent } from './components/contract/contract-modal-add-sku/contract-modal-add-sku.component';
import { SkuBlukUploadDirective } from './directives/sku-bluk-upload.directive';
import { SkuBlukReuploadModalComponent } from './components/contract/modals/sku-bluk-reupload-modal/sku-bluk-reupload-modal.component';
import { SkuCreateDraftDetailsComponent } from './components/sku/sku-create-draft-details/sku-create-draft-details.component';
import { SkuDraftListComponent } from './components/sku/sku-draft-list/sku-draft-list.component';
import { LocalDateFormatPipe } from './pipes/local-date-format.pipe';
import { Select2Module } from 'ng-select2-component';
import { DictionaryPipe } from './pipes/dictionary.pipe';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import { ShopAddressSpanComponent } from './components/shops/shop-address-span/shop-address-span.component';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { VoucherNumberTypePipe } from './pipes/voucher-number.pipe';
import { CostCalculationPipe } from './pipes/cost-calculation.pipe';

@NgModule({
  declarations: [
    MerchantListComponent,
    MerchantCreateComponent,
    MerchantDetailsComponent,
    MerchantEditComponent,
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
    VoucherNumberRuleListComponent,
    VoucherNumberRuleCreateComponent,
    VoucherNumberRuleFormComponent,
    MerchantFormComponent,
    ShopFormComponent,
    VoucherNumberRuleEditComponent,
    AcceptanceLoopFormComponent,
    AcceptanceLoopCreateComponent,
    AcceptanceLoopEditComponent,
    AcceptanceLoopShopComponent,
    ShopStatusTypePipe,
    MerchantAcceptanceLoopListComponent,
    VoucherNumberRuleDeleteComponent,
    ThirdPartyVoucherNumberRuleFormComponent,
    ContractListComponent,
    ContractCreateComponent,
    ContractFormComponent,
    SKUFormComponent,
    SKUCreateComponent,
    VoucherNumberRuleDeleteErrorComponent,
    MerchantGroupDetailsComponent,
    MerchantGroupManagementComponent,
    MerchantGroupSkuManagementComponent,
    MerchantGroupSkuDetailsComponent,
    MerchantGroupSkuViewComponent,
    PopupForAddMerchantComponent,
    DatePickerComponent,
    ContractDetailsComponent,
    MerchantContractListComponent,
    SkuListComponent,
    MerchantSkuListComponent,
    MerchantGroupAcceptanceLoopShopComponent,
    MerchantGroupAcceptanceLoopCreateComponent,
    MerchantGroupAcceptanceLoopListComponent,
    MerchantGroupAcceptanceLoopViewModalComponent,
    MerchantGroupAcceptanceLoopEditComponent,
    MerchantGroupAcceptanceLoopFormComponent,
    MerchantGroupMerchantMapComponent,
    SkuEditComponent,
    AcceptanceLoopListComponent,
    ContractModalEditPeriodComponent,
    ContractModalAddSkuComponent,
    ContractEditComponent,
    SkuBlukUploadDirective,
    SkuBlukReuploadModalComponent,
    SkuCreateDraftDetailsComponent,
    SkuDraftListComponent,
    LocalDateFormatPipe,
    DictionaryPipe,
    ShopAddressSpanComponent,
    YesNoPipe,
    VoucherNumberTypePipe,
    CostCalculationPipe
  ],
  imports: [
    MerchantRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    SharedModule,
    SimplebarAngularModule,
    Select2Module,
    ComponentLibraryModule,
  ],
  providers: [
    ShopService,
    VoucherNumberRuleService,
    SecurityKeyService,
    DictionaryPipe,
  ],
})
export class MerchantModule {}
