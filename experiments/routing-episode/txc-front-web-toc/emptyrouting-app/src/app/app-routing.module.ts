import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/ecommerce',
    pathMatch: 'full'
  },
  { 
    path: "", 
    component: PrivateLayoutComponent, 
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) 
      }//http://localhost:4200/; http://localhost:4200/inventory/; http://localhost:4200/inventory/overview;
      //http://localhost:4200/merchant-sku/create; http://localhost:4200/maintenance/admin
    ]
  },
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) }, //http://localhost:4200/account/login
      { path: 'error-404', component: Error404Component },  //http://localhost:4200/error-404
      { path: 'error-500', component: Error500Component },  //http://localhost:4200/error-500
      { path: 'maintenance', component: MaintenanceComponent }, //http://localhost:4200/maintenance
      { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) } //http://localhost:4200/landing
    ]
  },
  /*{
    path: 'dashboard/ecommerce',
    component: Error500Component
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
