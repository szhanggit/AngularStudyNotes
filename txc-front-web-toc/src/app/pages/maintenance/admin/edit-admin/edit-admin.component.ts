import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { NgProgressComponent } from 'ngx-progressbar';
import { UpdateAdminUser, UpdateAdminUserAppTenant } from 'src/app/core/models/maintenance/command/admin-user/update-admin-user';
import { AdminQryByIdDto, AdminUserAppTenantQryByIdDto } from 'src/app/core/models/maintenance/dto/admin-user/admin-qry-by-id-dto';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { GetRefAppTenantAdminRoleQry } from 'src/app/core/models/maintenance/queries/application/get-ref-app-tenant-admin-role-qry';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AdminUserService } from 'src/app/core/service/maintenance/admin-user/admin-user.service';
import { RefAdminRoleService } from 'src/app/core/service/maintenance/admin-user/ref-admin-role.service';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { ClaimManagerService } from 'src/app/core/service/security/claim-manager/claim-manager.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  selectedRole = true;

  ldapUser = new LdaUserModel();

  // dropdown
  applications!: Select2Data;
  tenants!: Select2Data;

  userIdQueryParam: number;

  // dto
  userToEdit = <AdminQryByIdDto><unknown>{
    userId: 0,
    isAdUser: false,
    appTenants: [] as AdminUserAppTenantQryByIdDto[]
  }

  // request
  editUserRequest = <UpdateAdminUser><unknown>{
    userId: 0,
    appTenants: []
  }

  userClaim = new UserAuthClaim();
  enabledUpdate : boolean = false;

  constructor(private readonly activatedRoute: ActivatedRoute
    , private readonly router: Router
    , private readonly ldapSvc: LdapUserService
    , private readonly adminUserSrv: AdminUserService
    , private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refRoleSvc: RefAdminRoleService
    , private readonly authSvc: AuthService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userIdQueryParam = params.id;
    });
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        this.subscribeToUser();
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
        this.checkAllowedOperation();
      });
  }

  private subscribeToUser() {
    this.adminUserSrv.getById(this.userIdQueryParam).subscribe({
      next: (res) => this.setUser(res.data as AdminQryByIdDto)
    });
  }

  private setUser(data: AdminQryByIdDto){
    this.userToEdit = (data);

    this.ldapSvc.getLdapUser(this.userToEdit.userName).subscribe({
      next: (res) => {
        this.ldapUser = res
      }
    });

    this.userToEdit.appTenants.forEach(u => {
      if(u.tenantAppActive != null && u.tenantAppExpiration !== null){
        u.specifyExpiration = true;
        let activeDate = new Date(u.tenantAppActive);
        let expiredDate = new Date(u.tenantAppExpiration);
        u.fromDate = new NgbDate(activeDate.getFullYear(), activeDate.getMonth() + 1, activeDate.getDate());
        u.toDate = new NgbDate(expiredDate.getFullYear(), expiredDate.getMonth() + 1, expiredDate.getDate());
        u.selectedDateRange = u.fromDate.month + '/' + u.fromDate.day + '/' + u.fromDate.year + '-' + u.toDate.month + '/' + u.toDate.day + '/' + u.toDate.year;
        u.hoveredDate = null;
      }
      else{
        u.specifyExpiration = false;
        u.fromDate = null;
        u.toDate = null;
        u.selectedDateRange = '';
        u.hoveredDate = null;
      }

      // set tenant and app name if existing
      this.refTenantSvc.get().subscribe({
        next: (res) => {
          var tempTenants = res.data as RefTenantDto[];
          u.tenantName = tempTenants.find(x => x.tenantId == u.tenantId).tenantName
        }
      });
      this.refApplicationSvc.get().subscribe({
        next: (res) => {
          var tempApps = res.data as RefApplicationDto[];
          u.appName = tempApps.find(x => x.appId == u.appId).appName
        }
      });
    });
  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().subscribe({
      next: (res) => {
        this.tenants = (res.data as RefTenantDto[]).map(m => {
          return {
            label: m.tenantName,
            value: m.tenantId
          }
        });
      }
    });
  }

  private subscribeToApplicationAsRef() {
    this.refApplicationSvc.get().subscribe({
      next: (res) => {
        this.applications = (res.data as RefApplicationDto[]).map(m => {
          return {
            label: m.appName,
            value: m.appId
          }
        });
      }
    });
  }

  addTenantApplicationRole() {
    this.userToEdit.appTenants.push(<AdminUserAppTenantQryByIdDto>{
      uatId : 0,
      userRoleId: 0,
      tenantId: 0,
      appId: 0,
      adminRoleId: 0,
      tenantAppExpiration: null,
      tenantAppActive: null,
      roleActive: null,
      roleExpiration: null,
      isAssigned: false,
      tenantAppStatus: 1,
      userRoleStatus: 1,

      specifyExpiration: false,
      selectedDateRange: '',
      hoveredDate: null,
      fromDate: null,
      toDate: null,
    });
  }

  removeTenantApplicationRole(index: number) {
    if (this.userToEdit.appTenants.length > 1) {
      this.userToEdit.appTenants.splice(index, 1);
    }
  }

  setRolesRef(model: AdminUserAppTenantQryByIdDto) {
    if (model.tenantId && model.appId && model.tenantId != 0 && model.appId != 0) {
      this.refRoleSvc.get(model.tenantId, model.appId).subscribe({
        next: (res) => {
          var data = res.data as GetRefAppTenantAdminRoleQry;
          if(data != null && data.adminRoleId != 0){
              model.adminRoleId = data.adminRoleId;
              this.selectedRole = true;
          }else{
            this.toast.showDanger("No administrator role available in this business unit and application");
            this.selectedRole = true;
          }
        },
        error: (error) => {
          this.toast.showDanger("Error in getting administrator role");
          this.selectedRole = true;
        },
        complete: () => {
        }
      });
    }
  }

  editUser(){
    this.progressBar.start();
    this.editUserRequest.userId = this.userToEdit.userId;
    this.editUserRequest.createdBy = this.userClaim.user.userName;
    this.editUserRequest.appTenants = [];

    var isHaveInvalidRole = this.userToEdit.appTenants.some(p => p.adminRoleId == 0);

    if(isHaveInvalidRole)
    {
      this.toast.showDanger("One of the selected role is invalid");
      return;
    }

    this.userToEdit.appTenants.forEach(p => {
      this.editUserRequest.appTenants.push(<UpdateAdminUserAppTenant><unknown>{
        uatId: p.uatId,
        userRoleId: p.userRoleId,
        tenantId: p.tenantId,
        appId: p.appId,
        adminRoleId: p.adminRoleId,
        expirationDate: p.tenantAppExpiration,
        activeDate: p.tenantAppActive,
        isAssigned: true
      });
    });

    if(this.hasDuplicates(this.editUserRequest.appTenants)){
      this.toast.showDanger("Duplicate application and business unit selected");
      this.progressBar.complete();
      return;
    }

    const subscriber = this.adminUserSrv.put(this.editUserRequest)
      .subscribe({
        next: (res) => {
          if(res.success){
            this.router.navigateByUrl('/maintenance/admin-management', { state: { editAdmin: true } });
          }else{
            this.toast.showDanger(res.data);
          }

        },
        error: (error) => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        },
        complete: () => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        }
      });
  }

  resetEdit() {
    this.subscribeToUser();
  }

    // date range picker configs
  onDefaultRoleDateSelection(date: NgbDate, model: AdminUserAppTenantQryByIdDto) {
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
      var hours = 0 + 8; // depending on timezone
      model.tenantAppActive = new Date(model.fromDate.year, model.fromDate.month - 1, model.fromDate.day, hours);
      model.tenantAppExpiration = new Date(model.toDate.year, model.toDate.month - 1, model.toDate.day, hours);
    }
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

  clearDefaultDateRange(model: AdminUserAppTenantQryByIdDto) {
    model.tenantAppExpiration = null;
    model.roleExpiration = null;

    model.selectedDateRange = '';
    model.hoveredDate = null;
    model.fromDate = null;
    model.toDate = null;
  }

  private hasDuplicates(arrays: UpdateAdminUserAppTenant[]) : boolean {
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

  checkAllowedOperation()
  {
    let updateAdminOpsId = parseInt(environment.upd_admin_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledUpdate = this.userClaim.operations.some(e => e === updateAdminOpsId);
    }
  }

}
