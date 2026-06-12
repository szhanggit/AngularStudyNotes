import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AnalyticsComponent } from './analytics/analytics.component';
import { EWalletComponent } from './e-wallet/e-wallet.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  {
    path: 'ecommerce',
    component: EcommerceComponent
  },
  {
    path: '',
    redirectTo: 'dashboard/ecommerce',
    pathMatch: 'full'
  },
  {
    path: 'project',
    component: ProjectsComponent
  },
  {
    path: 'e-wallet',
    component: EWalletComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
