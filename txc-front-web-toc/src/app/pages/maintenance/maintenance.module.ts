import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { AddAdminComponent } from './admin/add-admin/add-admin.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { RoleManagementComponent } from './role/role-management/role-management.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UserManagementComponent } from './user/user-management/user-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbProgressbarModule, NgbDropdownModule, NgbDatepickerModule, NgbTimepickerModule, NgbTypeaheadModule, NgbNavModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskModule } from 'ngx-mask';
import { NgProgressModule } from 'ngx-progressbar';
import { QuillModule } from 'ngx-quill';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TenantListComponent } from './tenant/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './tenant/tenant-details/tenant-details.component';
import { ImageListComponent } from './media/image-list/image-list.component';
import { KeyLoginComponent } from './supper-admin/key-login/key-login.component';
import { KeySaveComponent } from './supper-admin/key-save/key-save.component';
import { SuperAdminCreationComponent } from './supper-admin/super-admin-creation/super-admin-creation.component';
import { AddNewSuperAdminComponent } from './supper-admin/super-admin-creation/add-new-super-admin/add-new-super-admin.component';
import { SuperAdminListComponent } from './supper-admin/super-admin-creation/super-admin-list/super-admin-list.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { EditAdminComponent } from './admin/edit-admin/edit-admin.component';
import { AgGridModule } from 'ag-grid-angular';
import { RolesColComponent } from './user/user-management/user-mgmt-ag-grid/roles-col/roles-col.component';
import { RoleStatusColComponent } from './user/user-management/user-mgmt-ag-grid/role-status-col/role-status-col.component';
import { CreateDateColComponent } from './user/user-management/user-mgmt-ag-grid/create-date-col/create-date-col.component';
import { ActionsColComponent } from './user/user-management/user-mgmt-ag-grid/actions-col/actions-col.component';
import { UsernameColComponent } from './user/user-management/user-mgmt-ag-grid/username-col/username-col.component';
import { TenantManagementComponent } from './tenant/tenant-management/tenant-management.component';
import { TlActionsColumnComponent } from './tenant/tenant-list/tl-actions-column/tl-actions-column.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { AdminActionColComponent } from './admin/admin-management/admin-management-ag-grid/admin-action-col/admin-action-col.component';
import { AdminUsernameColComponent } from './admin/admin-management/admin-management-ag-grid/admin-username-col/admin-username-col.component';
import { AdminCreateDateColComponent } from './admin/admin-management/admin-management-ag-grid/admin-create-date-col/admin-create-date-col.component';
import { AdminRoleStatusColComponent } from './admin/admin-management/admin-management-ag-grid/admin-role-status-col/admin-role-status-col.component';
import { RoleActionColComponent } from './role/role-management/role-management-ag-grid/role-action-col/role-action-col.component';
import { RoleMgmtResourceColComponent } from './role/role-management/role-management-ag-grid/role-mgmt-resource-col/role-mgmt-resource-col.component';
import { RoleMgmtOperationDetailsColComponent } from './role/role-management/role-management-ag-grid/role-mgmt-operation-details-col/role-mgmt-operation-details-col.component';
import { SuperAdminCreateDateColComponent } from './supper-admin/super-admin-creation/super-admin-list/super-admin-create-date-col/super-admin-create-date-col.component';
import { SuperAdminUsernameColComponent } from './supper-admin/super-admin-creation/super-admin-list/super-admin-username-col/super-admin-username-col.component';
import { SuperAdminRoleStatusColComponent } from './supper-admin/super-admin-creation/super-admin-list/super-admin-role-status-col/super-admin-role-status-col.component';
import { AccessManagementModuleComponent } from './access-management-module/access-management-module.component';

@NgModule({
  declarations: [
    AdminManagementComponent,
    AddAdminComponent,
    RoleManagementComponent,
    AddRoleComponent,
    UserManagementComponent,
    AddUserComponent,
    TenantListComponent,
    TenantDetailsComponent,
    ImageListComponent,
    KeyLoginComponent,
    KeySaveComponent,
    SuperAdminCreationComponent,
    AddNewSuperAdminComponent,
    SuperAdminListComponent,
    EditUserComponent,
    EditAdminComponent,
    RolesColComponent,
    RoleStatusColComponent,
    CreateDateColComponent,
    ActionsColComponent,
    UsernameColComponent,
    EditRoleComponent,
    AdminActionColComponent,
    AdminUsernameColComponent,
    AdminCreateDateColComponent,
    AdminRoleStatusColComponent,
    TenantManagementComponent,
    TlActionsColumnComponent,
    EditRoleComponent,
    RoleActionColComponent,
    RoleMgmtResourceColComponent,
    RoleMgmtOperationDetailsColComponent,
    SuperAdminCreateDateColComponent,
    SuperAdminUsernameColComponent,
    SuperAdminRoleStatusColComponent,
    AccessManagementModuleComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    QuillModule,
    NgbTooltipModule,
    NgxDropzoneModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbDatepickerModule,
    AgGridModule.withComponents([UsernameColComponent, RolesColComponent, RoleStatusColComponent, CreateDateColComponent, ActionsColComponent]),
    NgbTimepickerModule,
    NgbTypeaheadModule,
    NgxMaskModule.forRoot(),
    NgbNavModule,
    PageTitleModule,
    MaintenanceRoutingModule,
    NgProgressModule.withConfig({
      trickleSpeed: 200,
      min: 20,
      meteor: true
    })
  ]
})
export class MaintenanceModule { }
