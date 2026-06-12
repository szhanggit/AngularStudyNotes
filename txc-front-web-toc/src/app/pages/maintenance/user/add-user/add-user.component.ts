import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
// services
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefAppTenantRoleService } from 'src/app/core/service/maintenance/ref-app-tenant-role.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { UserService } from 'src/app/core/service/maintenance/user/user.service';
import { RoleSmartSearchService } from 'src/app/core/service/maintenance/user/role-smart-search.service';
// DTOs/models
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RefAssigningAppTenantRoleDto, RefAppTenantAssigningRoleDto } from 'src/app/core/models/maintenance/dto/application/ref-assigning-app-tenant-dto';
// queries/commands
import { CreateUserAppTenant, CreateUserCommand, CreateUserRoleReq } from 'src/app/core/models/maintenance/command/user/create-user-command';
import { GetRefAppTenantRoleQry } from 'src/app/core/models/maintenance/queries/application/get-ref-app-tenant-role-query';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefAppPermissionService } from 'src/app/core/service/maintenance/ref-app-permission.service';
import { RefAppPermissionDto } from 'src/app/core/models/maintenance/dto/application/ref-app-permission-dto';
import { RefRoleRsrOpsService } from 'src/app/core/service/maintenance/ref-role-rsr-ops.service';
import { GetRefRoleRsrOpsQry } from 'src/app/core/models/maintenance/queries/role/get-ref-role-rsr-ops-query';
import { RefAppTntRoleResOpsDto } from 'src/app/core/models/maintenance/dto/role/ref-app-tnt-role-res-ops-dto';
import { ClaimManagerService } from 'src/app/core/service/security/claim-manager/claim-manager.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { NgProgressComponent } from 'ngx-progressbar';
import { userType } from 'src/app/core/models/constants/user-type';
import { CheckUserPermissionService } from 'src/app/core/service/security/permission/check-user-permission.service';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  userFound: boolean = false;
  selectedRole: boolean = false;
  ldapUser = new LdaUserModel();
  searching: boolean = false;

  smartSearchRolesRef: string[] = [];
  smartSearchIndex: number = 0;

  // date picker config
  customRoleActiveDate!: Date;
  customRoleExpirationDate!: Date;

  // modal config
  modalModel!: any;

  // dropdown
  applications!: Select2Data;
  tenants!: Select2Data;

  createUserRequest = <CreateUserCommand><unknown>{
    isAdUser: true,
    applicationTenants: []
  }

  createUserAppTenant: CreateUserAppTenant[] = [];
  userClaim = new UserAuthClaim();

  constructor(private readonly ldapUserSvc: LdapUserService
    , private readonly userSvc: UserService
    , private readonly roleSmartSearchSvc: RoleSmartSearchService
    , private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refAppTenantRoleSvc: RefAppTenantRoleService
    , private readonly refRoleRsrOpsSvc: RefRoleRsrOpsService
    , private readonly refAppPermissionSvc: RefAppPermissionService
    , private readonly modalSvc: NgbModal
    , private readonly router: Router
    , private readonly authSvc: AuthService
    , private readonly checkUserPermissionSrv:  CheckUserPermissionService    ) {

    this.createUserAppTenant.push(<CreateUserAppTenant><unknown>{
      tenantId: 0,
      appId: 0,
      tenantAppActive: null,
      tenantAppExpiration: null,
      roles: [],

      specifyExpiration: false,
      rolesRef: [],
      filteredRolesRef: [],
      resourcesFilterRef: [],

      smartSearchValue: '',

      selectedDateRange: '',
      hoveredDate: null,
      fromDate: null,
      toDate: null
    });

  }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let addUserOpdId = parseInt(environment.add_user_op_id);
        if(! this.userClaim.operations.some(e => e === addUserOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
        this.roleSmartSearchSubscriber();
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
          this.toast.showDanger("Error while processing the request");
          setTimeout(() => this.searching = false, 1000);
          subscriber.unsubscribe();
        }
        , complete: () => {
          setTimeout(() => {
            this.searching = false;
          }, 1000);
          subscriber.unsubscribe();
          this.progressBar.complete();
        }
      });
  }

  addTenantApplicationRole() {
    this.createUserAppTenant.push(<CreateUserAppTenant><unknown>{
      tenantId: 0,
      appId: 0,
      tenantAppActive: null,
      tenantAppExpiration: null,
      roles: [],

      specifyExpiration: false,
      rolesRef: [],
      filteredRolesRef: [],
      resourcesFilterRef: [],

      smartSearchValue: '',

      selectedDateRange: '',
      hoveredDate: null,
      fromDate: null,
      toDate: null
    });
  }

  removeTenantApplicationRole(index: number) {
    if (this.createUserAppTenant.length > 1) {
      this.createUserAppTenant.splice(index, 1);
    }
  }

  setRolesRef(model: CreateUserAppTenant) {
    if (model.tenantId && model.appId  && model.tenantId != 0 && model.appId != 0) {
      var query = <GetRefAppTenantRoleQry><unknown>{
        appId: model.appId,
        tenantId: model.tenantId
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
        error: (error) => {
          this.toast.showDanger("Error in getting role");
        },
        complete: () => {
        }
      });
    }
  }

  initializeRolesRef(data: RefAssigningAppTenantRoleDto, model: CreateUserAppTenant) {
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

    this.roleSmartSearchSvc.setCreate(this.createUserAppTenant);
  }

  checkSelectedRole(tenantId: number, appId: number) {
    var appTenant = this.createUserAppTenant.filter(f => f.tenantId == tenantId && f.appId == appId);
    var item;
    if (appTenant.length > 0) {
      item = appTenant[0];
      this.selectedRole = item.filteredRolesRef.some(e => e.isAssigned == true);
    }
  }

  clearFields() {
    this.ldapUser = new LdaUserModel();
    this.createUserRequest = <CreateUserCommand><unknown>{
      userName: null,
      isAdUser: true,
      applicationTenants: []
    }
    this.createUserAppTenant = [];
    this.createUserAppTenant.push(<CreateUserAppTenant><unknown>{
      tenantId: 0,
      appId: 0,
      specifyExpiration: false,
      expiration: null,
      roles: [],
      rolesRef: [],
      filteredRolesRef: [],
      resourcesFilterRef: [],
      selectedDateRange: '',
      hoveredDate: null,
      fromDate: null,
      toDate: null
    });

    this.userFound = false;
  }

  clearDefaultDateRange(model: CreateUserAppTenant) {
    model.tenantAppActive = null;
    model.tenantAppExpiration = null;

    model.selectedDateRange = '';
    model.hoveredDate = null;
    model.fromDate = null;
    model.toDate = null;
  }

  addNewUser() {
    this.progressBar.start();
    this.createUserRequest.userName = this.ldapUser.userName;
    this.createUserRequest.createdBy = this.userClaim.user.userName;
    this.createUserRequest.applicationTenants = [];
    let today = new Date();

    this.createUserAppTenant.forEach(i => {

      if (i.tenantAppExpiration == null) {
        i.tenantAppActive = today
      }
      i.roles = [];
      i.filteredRolesRef.forEach(j => {
        if (j.isAssigned == true) {
          i.roles.push(<CreateUserRoleReq><unknown>{
            roleId: j.roleId,
            roleActive: j.roleActive != null ? j.roleActive : i.tenantAppActive,
            roleExpiration: j.roleExpiration != null ? j.roleExpiration : i.tenantAppExpiration
          })
        }
      })

    })

    this.createUserRequest.applicationTenants = this.createUserAppTenant;

    if(this.hasDuplicatesAppTenant(this.createUserRequest.applicationTenants)){
      this.toast.showDanger("Duplicate application and business unit selected");
      this.progressBar.complete();
      return;
    }

    const subscriber = this.userSvc.post(this.createUserRequest)
      .subscribe({
        next: (res) => {
          if(res.success)
          {
            this.router.navigateByUrl('/maintenance/user-management', { state: { createUser: true } });
          }
          else{
            this.toast.showDanger(res.message);
          }
        },
        error: (error) => {
          this.progressBar.complete();
          subscriber.unsubscribe();
        }, complete: () => {
          this.progressBar.complete();
          subscriber.unsubscribe();

        }
      })
  }

  // date range picker configs
  onDefaultRoleDateSelection(date: NgbDate, model: CreateUserAppTenant) {
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

  onCustomRoleDateSelection(date: NgbDate, model: RefAppTenantAssigningRoleDto) {
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
  openCustomExpiryModal(content: TemplateRef<NgbModal>, appTenantModel: CreateUserAppTenant, roleModel: RefAppTenantAssigningRoleDto): void {
    if (roleModel.isAssigned == true) {
      var appTenant = this.createUserAppTenant.filter(f => f.tenantId == appTenantModel.tenantId && f.appId == appTenantModel.appId)[0];
      var role = appTenant.rolesRef.filter(f => f.roleId == roleModel.roleId)[0];
      role.selectedDateRange = role.selectedDateRange != null ? role.selectedDateRange : '';

      this.modalModel = {
        roleCustom: role,
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

  openFilterRoleModal(content: TemplateRef<NgbModal>, appTenantModel: CreateUserAppTenant, index: number): void {
    this.modalModel = {
      appTenant: appTenantModel,
      index: index
    }
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  clearOperations(model: CreateUserAppTenant) {
    model.resourcesFilterRef.forEach(i => {
      i.operations.forEach(j => {
        j.isSelected = false;
      })
    });
  }

  filterRoles(model: CreateUserAppTenant) {

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
    console.log(input + ' ' + this.smartSearchIndex);

    this.roleSmartSearchSvc.addCreate(input, index);
  }

  roleSmartSearchSubscriber() {
    this.roleSmartSearchSvc.dataCreate.subscribe({
      next: (res) => {
        if((this.createUserAppTenant[this.smartSearchIndex]) && (res)){
          this.createUserAppTenant = res;
        }
      }
    })
  }

  refresh(model: CreateUserAppTenant){
    model.filteredRolesRef = [];
    model.smartSearchValue = '';
    Object.assign<RefAppTenantAssigningRoleDto[], RefAppTenantAssigningRoleDto[]>(model.filteredRolesRef, model.rolesRef);

    this.roleSmartSearchSvc.dataCreate.next(null);
    this.roleSmartSearchSvc.clear();
  }

  private hasDuplicatesAppTenant(arrays: CreateUserAppTenant[]) : boolean {
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
