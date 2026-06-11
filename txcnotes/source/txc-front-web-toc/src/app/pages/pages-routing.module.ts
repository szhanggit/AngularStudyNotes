import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { SecurityGuard } from '../core/guards/security.guard';
import { HomeComponent } from './custom-pages/landing/home/home.component';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: ()=> import('./maintenance/maintenance.module').then(m=> m.MaintenanceModule),
  // },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'maintenance',
    loadChildren: ()=> import('./maintenance/maintenance.module').then(m=> m.MaintenanceModule)
  },
  {
    path: 'merchant-sku',
    loadChildren: ()=> import('./merchant-sku/merchant-sku.module').then(m=> m.MerchantSkuModule)
  },
  {
    path: 'inventory',
    loadChildren: ()=> import('./inventory/inventory.module').then(m=> m.InventoryModule)
  },
  {
    path: 'products',
    loadChildren: ()=> import('./products/products.module').then(m=> m.ProductsModule)
  },
  {
    path: 'system',
    loadChildren: ()=> import('./system/system.module').then(m=> m.SystemModule)
  },
  {
    path : 'merchant-list',
    loadChildren: ()=> import('./merchant/merchant.module').then(m=> m.MerchantModule)
  },
  {
    path : 'merchants',
    loadChildren: ()=> import('./merchants/merchants.module').then(m=> m.MerchantsModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
