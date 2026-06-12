import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BusinessUnitGuard } from './shared/guards/business-unit.guard';
import { PageAuthorizationGuard } from '@txc-angular/authorization-library';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { Error401Component } from './security/components/errors/error401/error401.component';
import { Error403Component } from './security/components/errors/error403/error403.component';
import { Error404Component } from './security/components/errors/error404/error404.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./temp/temp.module').then(m => m.TempModule),
    canActivate: [BusinessUnitGuard]
  },
  {
    path: 'temp',
    loadChildren: () => import('./temp/temp.module').then(m => m.TempModule),
    canActivate: [BusinessUnitGuard]
  },
  {
    path: 'products',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.productPath,
      exposedModule: './products.module'
    }).then(m => m.ProductsModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'merchants',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.merchantPath,
      exposedModule: './merchant.module'
    }).then(m => m.MerchantModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'voucher',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.voucherPath,
      exposedModule: './voucher.module'
    }).then(m => m.VoucherModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'clients',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.clientPath,
      exposedModule: './client.module'
    }).then(m => m.ClientModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'order',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.orderPath,
      exposedModule: './order.module'
    }).then(m => m.OrderModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'system',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.systemPath,
      exposedModule: './system.module'
    }).then(m => m.SystemModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'batch-processor',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: environment.batchProcessorPath,
      exposedModule: './batch-processor.module'
    }).then(m => m.BatchProcessorModule),
    canActivate: [BusinessUnitGuard, PageAuthorizationGuard]
  },
  {
    path: 'error/401',
    component: Error401Component
  },
  {
    path: 'error/403',
    component: Error403Component
  },
  {
    path: 'error/404',
    component: Error404Component
  },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (pl: PlatformLocation) => pl.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    }
  ],
})
export class AppRoutingModule { }
