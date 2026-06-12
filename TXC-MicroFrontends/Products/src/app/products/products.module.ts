import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductTypePipe } from './pipes/product-type.pipe';
import { GeneratedByPipe } from './pipes/generated-by.pipe';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ProductWizardBackPipe } from './pipes/product-wizard-stepper-back.pipe';
import { ProductWizardNextPipe } from './pipes/product-wizard-stepper-next.pipe';
import { CreateProuductTitlePipe } from './pipes/create-product-title.pipe';
import { ProductTypeComponent } from './components/create-product/product-type/product-type.component';
import { ProductDetailsComponent } from './components/create-product/product-details/product-details.component';
import { ProductPricingComponent } from './components/create-product/product-pricing/product-pricing.component';
import { ProductTemplateComponent } from './components/create-product/product-template/product-template.component';
import { ProductPropertiesComponent } from './components/create-product/product-properties/product-properties.component';
import { ProductReviewComponent } from './components/create-product/product-review/product-review.component';
import { DictionaryPipe } from './pipes/dictionary.pipe';
import { ProductCustomizationService } from './services/product-customization.service';
import { MainProductDetailsComponent } from './components/main-product-details/main-product-details.component';
import { EditProductDetailsComponent } from './components/main-product-details/edit/edit-product-details/edit-product-details.component';
import { ProductHistoryComponent } from './components/main-product-details/product-history/product-history.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { BasicInfoComponent } from './components/main-product-details/basic-info/basic-info.component';
import { HistoryDetailsComponent } from './components/main-product-details/product-history/history-details/history-details.component';
import { EditPricingExpiryComponent } from './components/main-product-details/edit/edit-pricing-expiry/edit-pricing-expiry.component';
import { SharedModule } from '../shared/shared.module';
import { EditExternalPropertiesComponent } from './components/main-product-details/edit/edit-external-properties/edit-external-properties.component';
import { ProductComboComponent } from './components/create-product/product-combo/product-combo.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { VoucherNumberRuleTableComponent } from './components/shared/voucher-number-rule-table/voucher-number-rule-table.component';
import { AcceptanceLoopTableComponent } from './components/shared/acceptance-loop-table/acceptance-loop-table.component';
import { MasterProductComponent } from './components/master-product/master-product.component';
import { MasterProductAdvanceSettingsComponent } from './components/master-product/master-product-advance-settings/master-product-advance-settings.component';
import { MasterProductPricingAndExpiryComponent } from './components/master-product/master-product-pricing-and-expiry/master-product-pricing-and-expiry.component';
import { MasterProductProductComboComponent } from './components/master-product/master-product-product-combo/master-product-product-combo.component';
import { MasterProductProductDetailsComponent } from './components/master-product/master-product-product-details/master-product-product-details.component';
import { MasterProductProductTemplateComponent } from './components/master-product/master-product-product-template/master-product-product-template.component';
import { MasterProductReviewAndConfirmComponent } from './components/master-product/master-product-review-and-confirm/master-product-review-and-confirm.component';
import { IntervalUnitPipe } from './pipes/interval-unit.pipe';
import { DayOfTheWeekPipe } from './pipes/dayoftheweek.pipe';
import { HoursFilterPipe } from './pipes/hoursfilter.pipe';
import { TemplatePreviewComponent } from './components/create-product/product-template/template-preview/template-preview.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TemplateTagComponent } from './components/create-product/product-template/template-tag/template-tag.component';
import { MasterProductProductTemplatePreviewComponent } from './components/shared/master-product-product-template-preview/master-product-product-template-preview.component';
import { VoucherTemplateComponent } from './components/shared/voucher-template/voucher-template.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { StringSplitByCapitalLetterPipe } from './pipes/string-split-by-capital-letter.pipe';
import { Select2Module } from 'ng-select2-component';
import { MerchantSkuComponent } from './components/shared/merchant-sku/merchant-sku.component';
import { IssuerTypePipe } from './pipes/issuer-type.pipe';
import { ProductTagPipe } from './pipes/product-tag.pipe';
import { MultipleSelectionTypePipe } from './pipes/multiple-selection-type.pipe';
import { ProductCategoryPipe } from './pipes/product-category.pipe';
import { ExpirySchemeComponent } from './components/shared/expiry-scheme/expiry-scheme.component';
import { ExpirySchemeSelectorComponent } from './components/create-product/product-pricing/expiry-scheme-selector/expiry-scheme-selector.component';
import { MasterProductService } from './services/master-product.service';
import { SmsTemplateComponent } from './components/shared/sms-template/sms-template.component';
import { EditProductTemplateComponent } from './components/main-product-details/edit/edit-product-template/edit-product-template.component';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import { BatchUpdateProductComponent } from './components/batch-update-product/batch-update-product.component';
import { ProductComboExistingSectionComponent } from './components/master-product/master-product-product-combo/product-combo-existing-section/product-combo-existing-section.component';
import { ProductComboRearrangeSectionComponent } from './components/master-product/master-product-product-combo/product-combo-rearrange-section/product-combo-rearrange-section.component';
import { ProductComboSearchSectionComponent } from './components/master-product/master-product-product-combo/product-combo-search-section/product-combo-search-section.component';
import { ProductComboConfirmSectionComponent } from './components/master-product/master-product-product-combo/product-combo-confirm-section/product-combo-confirm-section.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetime';
import { ProductComboBatchUpdateComponent } from './components/master-product/master-product-product-combo/product-combo-batch-update/product-combo-batch-update.component';
import { DefaultIntl } from './models/owldatetimeIntl.model';
import { ReverseLimitPipe } from './pipes/reverselimit.pipe';
import { DictionaryByNamePipe } from './pipes/dictionaryByName.pipe';
import { FixedExpiryModalComponent } from './components/create-product/product-pricing/fixed-expiry-modal/fixed-expiry-modal.component';
import { FlexibleExpiryModalComponent } from './components/create-product/product-pricing/flexible-expiry-modal/flexible-expiry-modal.component';
import { ExpirySchemeFixedFlexibleComponent } from './components/shared/expiry-scheme-fixed-flexible/expiry-scheme-fixed-flexible.component';
import { ExpirySchemeFixedComponent } from './components/shared/expiry-scheme-fixed-flexible/expiry-scheme-fixed/expiry-scheme-fixed.component';
import { ExpirySchemeFlexibleComponent } from './components/shared/expiry-scheme-fixed-flexible/expiry-scheme-flexible/expiry-scheme-flexible.component';
import { VoucherNumberTypePipe } from './pipes/voucher-number-type.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { ApplyChildProductsQuotationComponent } from './components/child-products-quotation/apply-child-products-quotation/apply-child-products-quotation.component';
import { UploadQuotationAreaComponent } from './components/child-products-quotation/upload-quotation-area/upload-quotation-area.component';
import { ErrorMessageComponent } from './components/shared/error-message/error-message.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductTypePipe,
    GeneratedByPipe,
    DictionaryPipe,
    CreateProductComponent,
    CreateProuductTitlePipe,
    ProductWizardBackPipe,
    ProductWizardNextPipe,
    ProductTypeComponent,
    ProductDetailsComponent,
    ProductPricingComponent,
    ProductTemplateComponent,
    ProductPropertiesComponent,
    ProductReviewComponent,
    MainProductDetailsComponent,
    EditProductDetailsComponent,
    ProductHistoryComponent,
    BasicInfoComponent,
    HistoryDetailsComponent,
    EditPricingExpiryComponent,
    EditExternalPropertiesComponent,
    ProductComboComponent,
    VoucherNumberRuleTableComponent,
    AcceptanceLoopTableComponent,
    MasterProductComponent,
    MasterProductAdvanceSettingsComponent,
    MasterProductPricingAndExpiryComponent,
    MasterProductProductComboComponent,
    MasterProductProductDetailsComponent,
    MasterProductProductTemplateComponent,
    MasterProductReviewAndConfirmComponent,
    IntervalUnitPipe,
    DayOfTheWeekPipe,
    HoursFilterPipe,
    TemplatePreviewComponent,
    SafeHtmlPipe,
    TemplateTagComponent,
    MasterProductProductTemplatePreviewComponent,
    VoucherTemplateComponent,
    StringSplitByCapitalLetterPipe,
    MerchantSkuComponent,
    IssuerTypePipe,
    ProductTagPipe,
    MultipleSelectionTypePipe,
    ProductCategoryPipe,
    DictionaryByNamePipe,
    ExpirySchemeComponent,
    ExpirySchemeSelectorComponent,
    SmsTemplateComponent,
    EditProductTemplateComponent,
    BatchUpdateProductComponent,
    ProductComboExistingSectionComponent,
    ProductComboRearrangeSectionComponent,
    ProductComboSearchSectionComponent,
    ProductComboConfirmSectionComponent,
    ProductComboBatchUpdateComponent,
    ReverseLimitPipe,
    FixedExpiryModalComponent,
    FlexibleExpiryModalComponent,
    ExpirySchemeFixedFlexibleComponent,
    ExpirySchemeFixedComponent,
    ExpirySchemeFlexibleComponent,
    VoucherNumberTypePipe,
    YesNoPipe,
    ApplyChildProductsQuotationComponent,
    UploadQuotationAreaComponent,
    ErrorMessageComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ProductsRoutingModule,
    HttpClientModule,
    NgbTypeaheadModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    SimplebarAngularModule,
    SortablejsModule,
    AngularEditorModule,
    Select2Module,
    ComponentLibraryModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    ProductsRoutingModule
  ],
  providers: [
    ProductService,
    ProductCustomizationService,
    MasterProductService,
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }
  ]
})
export class ProductsModule {
}
