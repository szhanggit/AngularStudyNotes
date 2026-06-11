import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BootstrapExComponent } from './bootstrap-ex/bootstrap-ex.component';
import { BootstrapTXCComponent } from './bootstrap-txc/bootstrap-txc.component';
import { TxcFormComponent } from './txc-form/txc-form.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SystemExceptionComponent } from './system-exception/system-exception.component';

const routes: Routes = [
  {
    path:'ex', component: BootstrapExComponent,    
  },
  {
    path:'role', component: RoleManagementComponent,
  },
  {
    path: 'exc', component: SystemExceptionComponent,
  },
  {
    path:'**', component: TxcFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
