import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

// auth guard
import { AuthGuard } from './core/guards/auth.guard';
import { SecurityGuard } from './core/guards/security.guard';

// components
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { Error401Component } from './pages/custom-pages/error/error401/error401.component';
import { Error403Component } from './pages/custom-pages/error/error403/error403.component';
import { Error404Component } from './pages/custom-pages/error/error404/error404.component';
import { Error500Component } from './pages/custom-pages/error/error500/error500.component';
import { MaintenanceComponent } from './pages/custom-pages/others/maintenance/maintenance.component';

const routes: Routes = [
  {
    path: "",
    component: PrivateLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [SecurityGuard]
      }
    ],

  },
  {
    path: "",
    component: PublicLayoutComponent,
    children: [

      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      { path: '401', component: Error401Component },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },      
      { path: 'error-500', component: Error500Component },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'landing', loadChildren: () => import('./pages/custom-pages/landing/landing.module').then(m => m.LandingModule) }
    ]
  },
  { path: '**',
    pathMatch: 'full',
    component: Error404Component
  }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', enableTracing: true })],
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
