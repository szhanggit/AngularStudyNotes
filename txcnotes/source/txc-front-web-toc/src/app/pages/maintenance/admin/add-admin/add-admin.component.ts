import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { NgProgressComponent } from 'ngx-progressbar';
import { map, skip, takeLast } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { ApplicationModel } from 'src/app/core/models/maintenance/application-model';
import { CreateAdminCmd, CreateAdminUserAppTenant } from 'src/app/core/models/maintenance/command/admin-user/create-admin-cmd';
import { GetRefAppTenantAdminRoleQry } from 'src/app/core/models/maintenance/queries/application/get-ref-app-tenant-admin-role-qry';
import { TenantModel } from 'src/app/core/models/maintenance/tenant-model';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { ModResOpModel, UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AdminUserService } from 'src/app/core/service/maintenance/admin-user/admin-user.service';
import { RefAdminRoleService } from 'src/app/core/service/maintenance/admin-user/ref-admin-role.service';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  userFound: boolean = false;
  selectedRole = false;

  ldapUser = new LdaUserModel();
  searching: boolean = false;

  // dropdown
  applications!: Select2Data;
  tenants!: Select2Data;

  createUserRequest = <CreateAdminCmd><unknown>{
    userName: null,
    isAdUser: true,
    createdBy: "test-user",
    applicationTenants: []
  }
  createUserAppTenant: CreateAdminUserAppTenant[] = [];
  userClaim = new UserAuthClaim();

  constructor(private readonly ldapUserSvc: LdapUserService
    , private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refRoleSvc: RefAdminRoleService
    , private readonly adminUserSrv: AdminUserService
    , private readonly router: Router
    , private readonly authSvc: AuthService) {
   }
   ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let addAdminOpdId = parseInt(environment.add_admin_op_id);
        if(! this.userClaim.operations.some(e => e === addAdminOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
      });
  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().subscribe({
      next: (res) => {
        this.tenants = (res.data as TenantModel[]).map(m=> {
          return {
            label: m.tenantName,
            value: m.tenantId
          }
        }); res.data as TenantModel[];
      }
    });
  }

  private subscribeToApplicationAsRef() {
    this.refApplicationSvc.get().subscribe({
      next: (res) => {
        this.applications = (res.data as ApplicationModel[]).map(m=> {
          return {
            label: m.appName,
            value: m.appId
          }
        });
      }
    });
  }

  onSearchKeyUp(e: KeyboardEvent) {
    if (e.key.toLowerCase() == "enter") {
      this.searchUser()
    }
  }

  searchUser() {
    this.progressBar.start();
    this.userFound = false;
    this.searching = true;
    const subscriber = this.ldapUserSvc.getLdapIfNotExistsUser(this.createUserRequest.userName)
      .subscribe({
        next: (res) => {
          if(!res?.success){
            this.toast?.showDanger(res.message);
          }
          else{
            this.ldapUser = res.data as LdaUserModel;
            this.userFound = true;
          }
        }
        , error: (error) => {
          setTimeout(() => this.searching = false, 1000);
          this.toast.showDanger("Error while processing the request");
          this.progressBar.complete();
          subscriber.unsubscribe();
        }
        , complete: () => {
          setTimeout(() => {
            this.searching = false;
          }, 1000);
          this.progressBar.complete();
          subscriber.unsubscribe();
        }
      });
  }

  setRolesRef(model: CreateAdminUserAppTenant) {
    if (model.tenantId && model.appId && model.tenantId != 0 && model.appId != 0) {
      this.refRoleSvc.get(model.tenantId, model.appId).subscribe({
        next: (res) => {
          var data = res.data as GetRefAppTenantAdminRoleQry;
          if(data != null && data.adminRoleId != 0){
              model.adminRoleId = data.adminRoleId;
              this.selectedRole = true;
          }else{
            this.toast.showDanger("No administrator role available in this business unit and application");
            this.selectedRole = false;
          }
        },
        error: err => {
          this.toast.showDanger("Error in getting administrator role");
          this.selectedRole = false;
        },
        complete: () => {
        }
      });
    }
  }

  addTenantApplicationRole() {
    if(this.userFound){
      this.createUserAppTenant.push(<CreateAdminUserAppTenant><unknown>{
          tenantId: 0,
          appId: 0,
          expirationDate: null,
          activeDate: null,
          adminRoleId: 0,
          specifyExpiration: false,
          selectedDateRange: '',
          hoveredDate: null,
          fromDate: null,
          toDate: null
        });
    }
    else {
      // this.toastrSvc.warning('No user selected');
    }

    this.selectedRole = false;
  }

  removeTenantApplicationRole(index: number) {
    if (this.createUserAppTenant.length > 1) {
      this.createUserAppTenant.splice(index, 1);
    }
  }

  addNewUser() {

    this.progressBar.start();
    this.createUserRequest.userName = this.ldapUser.userName;
    this.createUserRequest.applicationTenants = [];

    this.createUserAppTenant.forEach(m =>
      {
          if(m.adminRoleId === 0 || m.adminRoleId === null || m.adminRoleId === undefined ||
             m.tenantId === 0 || m.tenantId === null || m.tenantId === undefined ||
             m.appId === 0 || m.appId === null || m.appId === undefined) {
              this.toast.showDanger('Invalid value for tenant and application');
              this.progressBar.complete();
              return;
            }
      });

    this.createUserRequest.applicationTenants = this.createUserAppTenant;
    this.createUserRequest.createdBy = this.userClaim.user.userName;
    if(this.hasDuplicates(this.createUserRequest.applicationTenants)){
      this.toast.showDanger("Duplicate application and business unit selected");
      this.progressBar.complete();
      return;
    }

    const subscriber = this.adminUserSrv.post(this.createUserRequest)
      .subscribe({
        next: (res) => {
          if(res.success){
            this.router.navigateByUrl('/maintenance/admin-management', { state: { createAdmin: true } });
            this.ldapUser = new LdaUserModel();
          }else{
            this.toast.showDanger(res.message);
          }
        },
        error: (error) => {
          this.progressBar.complete();
        },
        complete: () => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        }
      })
  }

  clearFields() {
    this.ldapUser = new LdaUserModel();
    this.createUserRequest = <CreateAdminCmd>{
      userName: null,
      isAdUser: true,
      createdBy: null,
      applicationTenants: []
    }
    this.createUserAppTenant = [];
    this.createUserAppTenant.push(<CreateAdminUserAppTenant><unknown>{
      tenantId: 0,
      appId: 0,
      expirationDate: null,
      activeDate: null,
      adminRoleId: 0,
      specifyExpiration: false,
      selectedDateRange: '',
      hoveredDate: null,
      fromDate: null,
      toDate: null
    });
  }
  //date range method
  clearDefaultDateRange(model: CreateAdminUserAppTenant) {
    model.activeDate = null;
    model.expirationDate = null;

    model.selectedDateRange = '';
    model.hoveredDate = null;
    model.fromDate = null;
    model.toDate = null;
  }
  isHovered(date: NgbDate, model: any) {
    return model.fromDate && !model.toDate && model.hoveredDate && date.after(model.fromDate) && date.before(model.hoveredDate);
  }
  isInside(date: NgbDate, model: any) {
    return model.toDate && date.after(model.fromDate) && date.before(model.toDate);
  }
  isRange(date: NgbDate, model: any) {
    return date.equals(model.fromDate) || (model.toDate && date.equals(model.toDate)) || this.isInside(date, model) || this.isHovered(date, model);
  }
  onDefaultRoleDateSelection(date: NgbDate, model: CreateAdminUserAppTenant) {
    if (!model.fromDate && !model.toDate) {
      model.fromDate = date;
      model.selectedDateRange = model.fromDate.month + '/' + model.fromDate.day + '/' + model.fromDate.year;
    } else if (model.fromDate && !model.toDate && date.after(model.fromDate)) {
      model.toDate = date;
      model.selectedDateRange = model.fromDate.month + '/' + model.fromDate.day + '/' + model.fromDate.year + '-' + model.toDate.month + '/' + model.toDate.day + '/' + model.toDate.year
    } else {
      model.toDate = null;
      model.fromDate = date;
      model.selectedDateRange = "";
    }

    if (model.fromDate != null && model.toDate != null) {
      model.activeDate = new Date(model.fromDate.year, model.fromDate.month - 1, model.fromDate.day);
      model.expirationDate = new Date(model.toDate.year, model.toDate.month - 1, model.toDate.day);
    }
  }

  private hasDuplicates(arrays: CreateAdminUserAppTenant[]) : boolean {
    //ask homer hwo to implement this, but as of now api can handle duplicate combination bu,app and role
    let isDuplicate : boolean = false;
    if(arrays.length){
      arrays.forEach((el,ix,arr) =>
      {
        var items = arr.filter(p => p.tenantId == el.tenantId && p.appId == el.appId);
        if(items.length > 1){
          isDuplicate = true;
          return;
        }
      })
    }
    return isDuplicate;

  }

}
