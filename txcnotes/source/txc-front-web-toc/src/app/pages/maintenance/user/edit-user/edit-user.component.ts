import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// services
import { RefAppTenantRoleService } from 'src/app/core/service/maintenance/ref-app-tenant-role.service';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { UserService } from 'src/app/core/service/maintenance/user/user.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { RoleSmartSearchService } from 'src/app/core/service/maintenance/user/role-smart-search.service';
import { RefRoleRsrOpsService } from 'src/app/core/service/maintenance/ref-role-rsr-ops.service';
import { RefAppPermissionService } from 'src/app/core/service/maintenance/ref-app-permission.service';
// DTOs/models
import { RefAssigningAppTenantRoleDto, RefAppTenantAssigningRoleDto } from 'src/app/core/models/maintenance/dto/application/ref-assigning-app-tenant-dto';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { UserAppTenantQryByIdDto, UserQryByIdDto, UserRolesQryByIdDto } from 'src/app/core/models/maintenance/dto/user/user-query-by-id-dto';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { RefAppTntRoleResOpsDto } from 'src/app/core/models/maintenance/dto/role/ref-app-tnt-role-res-ops-dto';
import { RefAppPermissionDto } from 'src/app/core/models/maintenance/dto/application/ref-app-permission-dto';
// queries/commands
import { UpdateUserCommand, UpdUserAppTenant, UpdUserRoleReq } from 'src/app/core/models/maintenance/command/user/update-user-command';
import { GetRefAppTenantRoleQry } from 'src/app/core/models/maintenance/queries/application/get-ref-app-tenant-role-query';
import { GetRefRoleRsrOpsQry } from 'src/app/core/models/maintenance/queries/role/get-ref-role-rsr-ops-query';
import { ClaimManagerService } from 'src/app/core/service/security/claim-manager/claim-manager.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { NgProgressComponent } from 'ngx-progressbar';
import { userType } from 'src/app/core/models/constants/user-type';
import { CheckUserPermissionService } from 'src/app/core/service/security/permission/check-user-permission.service';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  ldapUser = new LdaUserModel();

  smartSearchRolesRef: string[] = [];
  smartSearchIndex: number = 0;

  // dropdown
  applications!: Select2Data;
  tenants!: Select2Data;

  userIdQueryParam: number;

  // date picker config
  customRoleActiveDate!: Date;
  customRoleExpirationDate!: Date;

  // modal config
  modalModel!: any;

  // dto
  userToEdit = <UserQryByIdDto><unknown>{
    userId: 0,
    isAdUser: false,
    appTenants: [] as UserAppTenantQryByIdDto[]
  }

  // request
  editUserRequest = <UpdateUserCommand><unknown>{
    userId: 0,
    appTenants: []
  }

  userClaim = new UserAuthClaim();
  enabledUpdate : boolean = false;

  constructor(private readonly activatedRoute: ActivatedRoute
    , private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly userSvc: UserService
    , private readonly roleSmartSearchSvc: RoleSmartSearchService
    , private readonly ldapSvc: LdapUserService
    , private readonly refAppTenantRoleSvc: RefAppTenantRoleService
    , private readonly refRoleRsrOpsSvc: RefRoleRsrOpsService
    , private readonly refAppPermissionSvc: RefAppPermissionService
    , private readonly modalSvc: NgbModal
    , private readonly router: Router
    , private readonly authSvc: AuthService) { }

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
    this.userSvc.getById(this.userIdQueryParam).subscribe({
      next: (res) => this.setUser(res.data as UserQryByIdDto)
    });
  }

  private setUser(data: UserQryByIdDto) {

    let userTypeClaim : string = this.userClaim.user.userType;
    let userTenantsClaim : number[] = this.userClaim.tenants;
    this.userToEdit = (data);

    if(userTypeClaim == userType.buManager){
      let filteredTenant : UserAppTenantQryByIdDto[];
      filteredTenant = data.appTenants.filter(p => userTenantsClaim.includes(p.tenantId));
      this.userToEdit.appTenants = filteredTenant;
    }

    this.userToEdit.appTenants.forEach(fe => {

      fe.rolesRef = [];
      fe.filteredRolesRef = [];
      fe.resourcesFilterRef = [];

      // set app tenant specify expiration, default expiration (ngbDate)
      if (fe.tenantAppActive !== null && fe.tenantAppExpiration !== null) {
        fe.specifyExpiration = true;
        let activeDate = new Date(fe.tenantAppActive);
        let expiredDate = new Date(fe.tenantAppExpiration);
        fe.fromDate = new NgbDate(activeDate.getFullYear(), activeDate.getMonth() + 1, activeDate.getDate());
        fe.toDate = new NgbDate(expiredDate.getFullYear(), expiredDate.getMonth() + 1, expiredDate.getDate());
        fe.selectedDateRange = fe.fromDate.month + '/' + fe.fromDate.day + '/' + fe.fromDate.year + '-' + fe.toDate.month + '/' + fe.toDate.day + '/' + fe.toDate.year;
        fe.hoveredDate = null;
      } else {
        fe.specifyExpiration = false;
        fe.fromDate = null;
        fe.toDate = null;
        fe.selectedDateRange = '';
        fe.hoveredDate = null;
      }

      // set tenant and app name if existing
      this.refTenantSvc.get().subscribe({
        next: (res) => {
          var tempTenants = res.data as RefTenantDto[];
          fe.tenantName = tempTenants.find(x => x.tenantId == fe.tenantId).tenantName
        }
      });
      this.refApplicationSvc.get().subscribe({
        next: (res) => {
          var tempApps = res.data as RefApplicationDto[];
          fe.appName = tempApps.find(x => x.appId == fe.appId).appName
        }
      });

      // set roles to rolesRef
      fe.roles.forEach(r => {
        if (r.roleActive !== null && r.roleExpiration !== null) {
          let roleActive = new Date(r.roleActive);
          let roleExpiration = new Date(r.roleExpiration);
          fe.rolesRef.push(<RefAppTenantAssigningRoleDto><unknown>{
            userRoleId: r.userRoleId,
            roleId: r.roleId,
            roleName: r.roleName,
            roleActive: r.roleActive,
            roleExpiration: r.roleExpiration,
            roleDescription: r.roleDescription,
            roleStatus: r.roleStatus,
            isAssigned: r.isAssigned,

            setCustomExpiry: true,
            fromDate: new NgbDate(roleActive.getFullYear(), roleActive.getMonth() + 1, roleActive.getDate()),
            toDate: new NgbDate(roleExpiration.getFullYear(), roleExpiration.getMonth() + 1, roleExpiration.getDate()),
            hoveredDate: null
          })
          var role = fe.rolesRef.filter(f => f.roleId == r.roleId)[0];
          role.selectedDateRange = role.fromDate.month + '/' + role.fromDate.day + '/' + role.fromDate.year + '-' + role.toDate.month + '/' + role.toDate.day + '/' + role.toDate.year
        } else {
          fe.rolesRef.push(<RefAppTenantAssigningRoleDto><unknown>{
            userRoleId: r.userRoleId,
            roleId: r.roleId,
            roleName: r.roleName,
            roleActive: null,
            roleExpiration: null,
            roleDescription: r.roleDescription,
            roleStatus: r.roleStatus,
            isAssigned: r.isAssigned,

            setCustomExpiry: false,
            fromDate: null,
            toDate: null,
            selectedDateRange: '',
            hoveredDate: null
          })
        }
      })

      fe.roles = [];

      var query = <GetRefRoleRsrOpsQry><unknown>{
        appId: fe.appId,
        tenantId: fe.tenantId
      }
      // initialize temp resource array
      let roleResources: RefAppTntRoleResOpsDto[] = [];
      // call service, populate resource array
      this.refRoleRsrOpsSvc.get(query).subscribe({
        next: (res) => {
          roleResources = (res.data as RefAppTntRoleResOpsDto[]);
          // set resources w/ operations per role
          fe.rolesRef.forEach(i => {
            if (!this.smartSearchRolesRef.includes(i.roleName)) {
              this.smartSearchRolesRef.push(i.roleName);
            }
            roleResources.forEach(j => {
              if (i.roleId == j.roleId) {
                i.resources = j.resources
                // set operation details
                i.resources.forEach(r => {
                  if (!this.smartSearchRolesRef.includes(r.resourceName)) {
                    this.smartSearchRolesRef.push(r.resourceName);
                  }
                  let operations: string[] = []
                  r.operations.forEach(o => {
                    if (!this.smartSearchRolesRef.includes(o.operationName)) {
                      this.smartSearchRolesRef.push(o.operationName);
                    }
                    operations.push(o.operationName);
                  });
                  r.operationDetails = operations.join(", ");
                  operations.splice(0, operations.length);
                })
              }
            })
          });

          Object.assign<RefAppTenantAssigningRoleDto[], RefAppTenantAssigningRoleDto[]>(fe.filteredRolesRef, fe.rolesRef);
        }
      });

      // set resource filter
      this.refAppPermissionSvc.get(fe.appId).subscribe({
        next: (res) => {
          fe.resourcesFilterRef = res.data as RefAppPermissionDto[];
          fe.resourcesFilterRef.forEach(i => {
            i.operations.forEach(j => {
              j.isSelected = false;
            })
          })
        }
      });
    });

    this.roleSmartSearchSvc.setEdit(this.userToEdit.appTenants);

    this.ldapSvc.getLdapUser(this.userToEdit.userName).subscribe({
      next: (res) => {
        this.ldapUser = res
      }
    });
  }

  private subscribeToTenantAsRef() {

    let userTypeClaim : string = this.userClaim.user.userType;
    let userTenantsClaim : number[] = this.userClaim.tenants;

    this.refTenantSvc.get().subscribe({
      next: (res) => {
        let tenantsResponse = res.data as RefTenantDto[];
        //temporary fixed to filter user must belong in the same tenant in the tenant claim of login BU manager
        if(userTypeClaim == userType.buAdmin){
            this.tenants = tenantsResponse.map(m => {
              return {
                label: m.tenantName,
                value: m.tenantId
              }
            });
        } else if(userTypeClaim == userType.buManager){
          const filtered = tenantsResponse.filter(p => userTenantsClaim.includes(p.tenantId));
          this.tenants = filtered.map(p =>
            {
              return {
                label: p.tenantName,
                value: p.tenantId
              }
            });
        }
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
    this.userToEdit.appTenants.push(<UserAppTenantQryByIdDto>{
      uatId: 0,
      appId: 0,
      tenantId: 0,
      tenantAppActive: null,
      tenantAppExpiration: null,
      tenantAppStatus: 1,
      roles: [] as UserRolesQryByIdDto[],

      specifyExpiration: false,
      rolesRef: [],
      filteredRolesRef: [],
      resourcesFilterRef: [],
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

  setRolesRef(model: UserAppTenantQryByIdDto) {

    if (model.tenantId && model.appId && model.uatId == 0) {
      var query = <GetRefAppTenantRoleQry><unknown>{
        tenantId: model.tenantId,
        appId: model.appId
      }
      this.refAppTenantRoleSvc.getAssigningRole(query).subscribe({
        next: (res) => {
          var data = res.data as RefAssigningAppTenantRoleDto;
          if(res.success){
            if(data != null && data.roles.length){
              this.initializeRolesRef(res.data as RefAssigningAppTenantRoleDto, model)
            }
          }else{
            this.toast.showDanger(res.message);
          }
        },
        error: (err) => {
          this.toast.showDanger("Error in getting role");
        },
        complete: () => {
        }
      });
    }

  }

  initializeRolesRef(data: RefAssigningAppTenantRoleDto, model: UserAppTenantQryByIdDto) {
    data.roles.forEach(fe => fe.setCustomExpiry = false)

    model.rolesRef = data.roles;

    var query = <GetRefRoleRsrOpsQry><unknown>{
      appId: model.appId,
      tenantId: model.tenantId
    }
    // initialize temp resource array
    let roleResources: RefAppTntRoleResOpsDto[] = [];
    // call service, populate resource array
    this.refRoleRsrOpsSvc.get(query).subscribe({
      next: (res) => {
        roleResources = (res.data as RefAppTntRoleResOpsDto[]);

        // set resources w/ operations per role
        model.rolesRef.forEach(i => {
          if (!this.smartSearchRolesRef.includes(i.roleName)) {
            this.smartSearchRolesRef.push(i.roleName);
          }
          roleResources.forEach(j => {
            if (i.roleId == j.roleId) {
              i.resources = j.resources
              // set operation details
              i.resources.forEach(r => {
                if (!this.smartSearchRolesRef.includes(r.resourceName)) {
                  this.smartSearchRolesRef.push(r.resourceName);
                }
                let operations: string[] = []
                r.operations.forEach(o => {
                  if (!this.smartSearchRolesRef.includes(o.operationName)) {
                    this.smartSearchRolesRef.push(o.operationName);
                  }
                  operations.push(o.operationName);
                });
                r.operationDetails = operations.join(", ");
                operations.splice(0, operations.length);
              })
            }
          })
        });
        model.filteredRolesRef = [];
        Object.assign<RefAppTenantAssigningRoleDto[], RefAppTenantAssigningRoleDto[]>(model.filteredRolesRef, model.rolesRef);
      }
    });

    // set resource filter
    this.refAppPermissionSvc.get(model.appId).subscribe({
      next: (res) => {
        model.resourcesFilterRef = res.data as RefAppPermissionDto[];
        model.resourcesFilterRef.forEach(i => {
          i.operations.forEach(j => {
            j.isSelected = false;
          })
        })
      }
    });

    this.roleSmartSearchSvc.setEdit(this.userToEdit.appTenants);

  }

  clearDefaultDateRange(model: UserAppTenantQryByIdDto) {

    model.tenantAppExpiration = null;

    model.selectedDateRange = '';
    model.hoveredDate = null;
    model.fromDate = null;
    model.toDate = null;

  }

  resetEdit() {
    this.subscribeToUser();
  }

  editUser() {
    this.progressBar.start();
    let today = new Date();

    this.editUserRequest.userId = this.userToEdit.userId;
    this.editUserRequest.createdBy = this.userClaim.user.userName; // placeholder
    this.editUserRequest.appTenants = [];
    // rolesRef to roles
    this.userToEdit.appTenants.forEach(i => {

      // new app tenant and no default expiration set
      if(i.uatId == 0 && i.tenantAppExpiration == null){
        i.tenantAppActive = today // set active to today
      }
      i.roles = [];
      i.filteredRolesRef.forEach(j => {
        if (j.isAssigned == true || j.userRoleId != 0) {
          i.roles.push(<UserRolesQryByIdDto><unknown>{
            userRoleId: j.userRoleId,
            roleName: j.roleName,
            roleDescription: j.roleDescription,
            roleId: j.roleId,
            roleActive: j.roleActive != null ? j.roleActive : i.tenantAppActive,
            roleExpiration: j.roleExpiration != null ? j.roleExpiration : i.tenantAppExpiration,
            roleStatus: j.roleStatus,
            isAssigned: j.isAssigned
          })
        }
      })
      this.editUserRequest.appTenants.push(<UpdUserAppTenant><unknown>{
        uatId: i.uatId,
        appId: i.appId,
        tenantId: i.tenantId,
        tenantAppActive: i.tenantAppActive,
        tenantAppExpiration: i.tenantAppExpiration,
        tenantAppStatus: i.tenantAppStatus,
        roles: i.roles as UpdUserRoleReq[]
      });

    });

    if(this.hasDuplicatesAppTenant(this.editUserRequest.appTenants)){
      this.toast.showDanger("Duplicate application and business unit selected");
      this.progressBar.complete();
      return;
    }

    const subscriber = this.userSvc.put(this.editUserRequest)
      .subscribe({
        next: (res) => {
          if(res.success)
          {
            this.router.navigateByUrl('/maintenance/user-management', { state: { editUser: true } });
          }
          else{
            this.toast.showDanger(res.message);
          }
        }, error: (error) => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        }, complete: () => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        }
      });
  }

  // date range picker configs
  onDefaultRoleDateSelection(date: NgbDate, model: UserAppTenantQryByIdDto) {
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

  onCustomRoleDateSelection(date: NgbDate, model: any) {
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
      this.customRoleActiveDate = new Date(model.fromDate.year, model.fromDate.month - 1, model.fromDate.day, hours);
      this.customRoleExpirationDate = new Date(model.toDate.year, model.toDate.month - 1, model.toDate.day, hours);
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

  // modal configs
  openCustomExpiryModal(content: TemplateRef<NgbModal>, appTenantModel: UserAppTenantQryByIdDto, roleModel: RefAppTenantAssigningRoleDto): void {
    if (roleModel.isAssigned == true) {

      this.modalModel = {
        roleCustom: roleModel,
        defaultActive: appTenantModel.tenantAppActive,
        defaultExpiration: appTenantModel.tenantAppExpiration
      }
      this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });

    }
  }

  setRoleExpiration(model: any) {
    if (model.roleCustom.setCustomExpiry) {
      model.roleCustom.roleActive = this.customRoleActiveDate;
      model.roleCustom.roleExpiration = this.customRoleExpirationDate;
    } else {
      model.roleCustom.roleActive = null;
      model.roleCustom.roleExpiration = null;
    }
  }

  openFilterRoleModal(content: TemplateRef<NgbModal>, appTenantModel: UserAppTenantQryByIdDto, index: number): void {
    this.modalModel = {
      appTenant: appTenantModel,
      index: index
    }
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  clearOperations(model: UserAppTenantQryByIdDto) {
    model.resourcesFilterRef.forEach(i => {
      i.operations.forEach(j => {
        j.isSelected = false;
      })
    });
  }

  filterRoles(model: UserAppTenantQryByIdDto) {

    let operationIds: number[] = [];
    let selections: boolean[] = [];

    model.resourcesFilterRef.forEach(resource => {
      selections.push(resource.operations.filter(f => f.isSelected).length > 0);
      resource.operations.forEach(operation => {
        if (operation.isSelected == true) {
          operationIds.push(operation.operationId);
        }
      })
    });

    if (selections.filter(f => f).length == 0) {
      model.filteredRolesRef = [];
      model.rolesRef.forEach(fe => model.filteredRolesRef.push(fe));
      return;
    }

    model.filteredRolesRef = model.rolesRef.filter(f => {
      var x = f.resources.filter(r => {
        var item = r.operations.filter(o => operationIds.indexOf(o.operationId) > -1).length > 0;
        return item;
      });
      return x.length > 0;
    })

  }

  // smart search config
  smartSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.smartSearchRolesRef.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  add(input: string, index: number) {
    this.smartSearchIndex = index;
    this.roleSmartSearchSvc.addEdit(input, index);
  }

  roleSmartSearchSubscriber() {
    this.roleSmartSearchSvc.dataEdit.subscribe({
      next: (res) => {
        if((this.userToEdit.appTenants[this.smartSearchIndex]) && (res)){
          this.userToEdit.appTenants = res;
        }
      }
    })
  }

  refresh(model: UserAppTenantQryByIdDto){
    model.filteredRolesRef = [];
    model.smartSearchValue = '';
    Object.assign<RefAppTenantAssigningRoleDto[], RefAppTenantAssigningRoleDto[]>(model.filteredRolesRef, model.rolesRef);

    this.roleSmartSearchSvc.dataEdit.next(null);
    this.roleSmartSearchSvc.clear();
  }
  private hasDuplicatesAppTenant(arrays: UpdUserAppTenant[]) : boolean {
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
    let updateUserOpsId = parseInt(environment.upd_user_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledUpdate = this.userClaim.operations.some(e => e === updateUserOpsId);
    }
  }

}
