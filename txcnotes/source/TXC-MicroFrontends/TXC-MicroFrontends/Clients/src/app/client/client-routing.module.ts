import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAuthorizationGuard } from '@txc-angular/authorization-library';
import { ClientCreateComponent } from './components/client-create/client-create.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientEditComponent } from './components/client-edit/client-edit.component';
import { ClientHistoryComponent } from './components/client-history-list/client-history-list.component';
import { ClientQuotationListComponent } from './components/client-quotation-list/client-quotation-list.component';

const routes: Routes = [
  {
    path : '', 
    component : ClientListComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path : 'details',
    component : ClientDetailsComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path : 'create',
    component : ClientCreateComponent,
    canActivate: [PageAuthorizationGuard]
  }, 
  {
    path: 'edit/:id',
    component : ClientEditComponent,
   canActivate: [PageAuthorizationGuard]
  },
  {
    path: 'history/:id',
    component : ClientHistoryComponent,
    canActivate: [PageAuthorizationGuard]
  },
  {
    path : 'quotationlist', 
    component : ClientQuotationListComponent,
    canActivate: [PageAuthorizationGuard]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
