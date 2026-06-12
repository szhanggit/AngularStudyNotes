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

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: MainProductDetailsComponent
  },
  {
    path: 'product/create',
    component: CreateProductComponent
  },
  {
    path: 'product/edit-details/:id',
    component: EditProductDetailsComponent
  },
  {
    path: 'product/edit-pricing/:id',
    component: EditPricingExpiryComponent
  },
  {
    path: 'product/edit-external-properties/:id',
    component: EditExternalPropertiesComponent
  },
  {
    path: 'product/history/:id',
    component: ProductHistoryComponent
  },
  {
    path: 'product/history-details/:id',
    component: HistoryDetailsComponent
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }