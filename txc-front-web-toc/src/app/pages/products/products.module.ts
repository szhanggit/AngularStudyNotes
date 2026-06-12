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
import { ProductWizardStepperComponent } from './components/create-product/product-wizard-stepper/product-wizard-stepper.component';
import { ProductTypeComponent } from './components/create-product/product-type/product-type.component';
import { ProductDetailsComponent } from './components/create-product/product-details/product-details.component';
import { ProductPricingComponent } from './components/create-product/product-pricing/product-pricing.component';
import { ProductTemplateComponent } from './components/create-product/product-template/product-template.component';
import { ProductPropertiesComponent } from './components/create-product/product-properties/product-properties.component';
import { ProductReviewComponent } from './components/create-product/product-review/product-review.component';
import { MerchantAcquirerPipe } from './pipes/merchant-acquirer.pipe';
import { ProductCustomizationService } from './services/product-customization.service';
import { MainProductDetailsComponent } from './components/main-product-details/main-product-details.component';
import { EditProductDetailsComponent } from './components/main-product-details/edit/edit-product-details/edit-product-details.component';
import { ProductHistoryComponent } from './components/main-product-details/product-history/product-history.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { BasicInfoComponent } from './components/main-product-details/basic-info/basic-info.component';
import { HistoryDetailsComponent } from './components/main-product-details/product-history/history-details/history-details.component';
import { EditPricingExpiryComponent } from './components/main-product-details/edit/edit-pricing-expiry/edit-pricing-expiry.component';
import { SharedModule } from '../../shared/shared.module';
import { EditExternalPropertiesComponent } from './components/main-product-details/edit/edit-external-properties/edit-external-properties.component';
import { ProductComboComponent } from './components/create-product/product-combo/product-combo.component';
import { SortablejsModule } from 'ngx-sortablejs';
@NgModule({
  declarations: [
    ProductListComponent,
    ProductTypePipe,
    GeneratedByPipe,
    MerchantAcquirerPipe,
    CreateProductComponent,
    CreateProuductTitlePipe,
    ProductWizardBackPipe,
    ProductWizardNextPipe,
    ProductWizardStepperComponent,
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
    ProductComboComponent
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
    SortablejsModule
  ],
  exports: [
    ProductsRoutingModule
  ],
  providers: [
    ProductService,
    ProductCustomizationService
  ]
})
export class ProductsModule {
}
