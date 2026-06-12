import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRMClientsComponent } from './clients/clients.component';
import { CRMDashboardComponent } from './dashboard/dashboard.component';
import { CRMManagementComponent } from './management/management.component';
import { CRMOrderListComponent } from './order-list/order-list.component';
import { CRMProjectComponent } from './project/project.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: CRMDashboardComponent
  },
  {
    path: 'order-list',
    component: CRMOrderListComponent
  },
  {
    path: 'clients',
    component: CRMClientsComponent
  },
  {
    path: 'project',
    component: CRMProjectComponent
  },
  {
    path: 'management',
    component: CRMManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
