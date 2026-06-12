import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityGuard } from 'src/app/core/guards/security.guard';
import { AccessManagementModuleComponent } from './access-management-module/access-management-module.component';
import { AddAdminComponent } from './admin/add-admin/add-admin.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { EditAdminComponent } from './admin/edit-admin/edit-admin.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { RoleManagementComponent } from './role/role-management/role-management.component';
import { KeyLoginComponent } from './supper-admin/key-login/key-login.component';
import { KeySaveComponent } from './supper-admin/key-save/key-save.component';
import { SuperAdminCreationComponent } from './supper-admin/super-admin-creation/super-admin-creation.component';
import { TenantDetailsComponent } from './tenant/tenant-details/tenant-details.component';
import { TenantManagementComponent } from './tenant/tenant-management/tenant-management.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { UserManagementComponent } from './user/user-management/user-management.component';

const routes: Routes = [
  {path: "", component: AccessManagementModuleComponent},
  {path: "user-management", component: UserManagementComponent},
  {path: "add-user", component: AddUserComponent},
  {path: "edit-user", component: EditUserComponent},
  {path: "admin-management", component: AdminManagementComponent},
  {path: "add-admin", component: AddAdminComponent},
  {path: "edit-admin", component: EditAdminComponent},
  {path: "role-management", component: RoleManagementComponent},
  {path: "add-role", component: AddRoleComponent},
  {path: "tenant-management", component: TenantManagementComponent},
  {path: "tenant", component: TenantDetailsComponent},
  {path: "tenant/:id", component: TenantDetailsComponent},
  {path: "edit-role", component: EditRoleComponent},
  {path: "keys", component: KeySaveComponent},
  {path: "key-validate", component: KeyLoginComponent},
  {path: "super-admin-creation", component: SuperAdminCreationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
