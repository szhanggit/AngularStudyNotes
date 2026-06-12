import { BatchUpdateProductComponent } from './components/batch-update-product/batch-update-product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditExternalPropertiesComponent } from './components/main-product-details/edit/edit-external-properties/edit-external-properties.component';
import { EditPricingExpiryComponent } from './components/main-product-details/edit/edit-pricing-expiry/edit-pricing-expiry.component';
import { EditProductDetailsComponent } from './components/main-product-details/edit/edit-product-details/edit-product-details.component';
import { MainProductDetailsComponent } from './components/main-product-details/main-product-details.component';
import { HistoryDetailsComponent } from './components/main-product-details/product-history/history-details/history-details.component';
import { ProductHistoryComponent } from './components/main-product-details/product-history/product-history.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PageAuthorizationGuard } from '@txc-angular/authorization-library';
import { MasterProductComponent } from './components/master-product/master-product.component';
import { EditProductTemplateComponent } from './components/main-product-details/edit/edit-product-template/edit-product-template.component';
import { ProductComboBatchUpdateComponent } from './components/master-product/master-product-product-combo/product-combo-batch-update/product-combo-batch-update.component';
import { ApplyChildProductsQuotationComponent } from './components/child-products-quotation/apply-child-products-quotation/apply-child-products-quotation.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/batch-update-product',
    component: BatchUpdateProductComponent
  },
  {
    path: 'product/create',
    component: CreateProductComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/edit-details/:id',
    component: EditProductDetailsComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/edit-pricing/:id',
    component: EditPricingExpiryComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/edit-template/:id',
    component: EditProductTemplateComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/edit-external-properties/:id',
    component: EditExternalPropertiesComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/history/:id',
    component: ProductHistoryComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/history-details/:id',
    component: HistoryDetailsComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'product/create/smart-choice-voucher',
    component: MasterProductComponent
  },
  {
    path: 'product/create/super-voucher',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/details/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/combo/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/pricing-expiry/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/template/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/smart-choice-voucher/advance-settings/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/details/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/combo/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/pricing-expiry/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/template/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/edit/super-voucher/advance-settings/:id',
    component: MasterProductComponent
  },
  {
    path: 'product/batch-update-product-combo',
    component: ProductComboBatchUpdateComponent
  },
  {
    path: 'apply-child-products-quotation',
    component: ApplyChildProductsQuotationComponent
  },
  {
    path: ':id',
    component: MainProductDetailsComponent,
    canActivate: [PageAuthorizationGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
