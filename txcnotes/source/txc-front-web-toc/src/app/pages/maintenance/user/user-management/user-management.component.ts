import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { ColumnApi, GridApi, ColDef, GridOptions, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { UsernameColComponent } from './user-mgmt-ag-grid/username-col/username-col.component';
import { RolesColComponent } from './user-mgmt-ag-grid/roles-col/roles-col.component';
import { RoleStatusColComponent } from './user-mgmt-ag-grid/role-status-col/role-status-col.component';
import { CreateDateColComponent } from './user-mgmt-ag-grid/create-date-col/create-date-col.component';
import { ActionsColComponent } from './user-mgmt-ag-grid/actions-col/actions-col.component';
import { filter, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
// services
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { RoleService } from 'src/app/core/service/maintenance/role/role.service';
import { UserService } from 'src/app/core/service/maintenance/user/user.service';
import { RefUserStatusService } from 'src/app/core/service/maintenance/ref-user-status.service';
import { RefUserRoleStatusService } from 'src/app/core/service/maintenance/ref-user-role-status.service';
import { ModalSubscriberService } from 'src/app/core/service/utilities/modal-subscriber.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { UserHistoryService } from 'src/app/core/service/maintenance/user-history/user-history-service.service';
// DTOs/models
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { GetRoleListQryRes } from 'src/app/core/models/maintenance/dto/role/role-query-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { GetAppUserAccessQryRes, UserQryDto } from 'src/app/core/models/maintenance/dto/user/user-query-dto';
import { RefUserStatusDto } from 'src/app/core/models/maintenance/dto/user/ref-user-status-dto';
import { RefUserRoleStatusDto } from 'src/app/core/models/maintenance/dto/role/ref-user-role-status-dto';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { UserHistoryByIdDto, UserHistoryDetailsByIdDto } from 'src/app/core/models/maintenance/dto/user/user-history-by-id-dto';
// queries/commands
import { GetRoleListQry } from 'src/app/core/models/maintenance/queries/role/get-role-list-query';
import { GetUserListQry } from 'src/app/core/models/maintenance/queries/user/get-user-list-query';
import { GetUserHistoryByIdQry } from 'src/app/core/models/maintenance/queries/user/get-user-history-by-id-query';
import { UpdateUserStatusCmd } from 'src/app/core/models/maintenance/command/user/update-user-status-command';
import { ClaimManagerService } from 'src/app/core/service/security/claim-manager/claim-manager.service';
import { AgGridColFitToSizeService } from 'src/app/core/service/tools/ag-grid-col-fit-to-size.service';
import { RefAppTenantRoleService } from 'src/app/core/service/maintenance/ref-app-tenant-role.service';
import { GetRefAppTenantRoleQry } from 'src/app/core/models/maintenance/queries/application/get-ref-app-tenant-role-query';
import { RefAppTenantRoleListDto } from 'src/app/core/models/maintenance/dto/application/ref-app-tenant-role-list-dto';
import { CheckUserPermissionService } from 'src/app/core/service/security/permission/check-user-permission.service';
import { userType } from 'src/app/core/models/constants/user-type';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {

  pageTitle: BreadcrumbItem[] = [];
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  private ngUnsubscribe = new Subject<void>();

  //custom pagination
  fixedRowCount: number = 20;
  currentPageNum: number = 0;
  currentTotalRowCount: number = 0;
  currentRowCount: number = 0;
  startRow: number = 0;
  endRow: number = 0;
  previousRow: number = 0;

  // dropdown
  tenants!: Select2Data;
  applications!: Select2Data;
  roles!: Select2Data;
  roleStatus!: Select2Data;
  userStatus!: Select2Data;

  // request
  filterRequest = <GetUserListQry><unknown>{
    searchKey: "",
    tenantId: 0,
    appId: 0,
    roleId: [],
    roleStatus: 0,
    userStatus: 0,

    pageNumber: 0,
    rowCount: this.fixedRowCount
  }

  // response
  users = <GetAppUserAccessQryRes><unknown>{
    userQryDto: [] as UserQryDto[],
    totalCount: 0
  }

  // modal config
  modalModel!: any;
  ldapUser = new LdaUserModel();
  @ViewChild('personalInfoModal', { static: true }) personalInfoModal: ElementRef;
  @ViewChild('blockUnblockModal', { static: true }) blockUnblockModal: ElementRef;
  @ViewChild('editHistoryModal', { static: true }) editHistoryModal: ElementRef;

  // toast
  createUser: boolean = false;
  editUser: boolean = false;

  // AgGrid
  gridApi: GridApi;
  colApi: ColumnApi;

  userMgmtCols: ColDef[] = [];
  usersData: UserQryDto[] = [];
  userMgmtGridOptions: GridOptions;

  editHistoryCols: ColDef[] = [];
  editHistoryData: UserHistoryDetailsByIdDto[] = [];
  editHistoryGridOptions: GridOptions;

  //temp fix
  buDefaultPlaceHolder : string;
  defTenantId : number;
  userClaim = new UserAuthClaim();

  enabledCreate : boolean = false;

  constructor(private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refUserRoleStatusSvc: RefUserRoleStatusService
    , private readonly refUserStatusSvc: RefUserStatusService
    , private readonly refRoleSvc: RefAppTenantRoleService
    , private readonly ldapSvc: LdapUserService
    , private readonly userSvc: UserService
    , private readonly userHistorySvc: UserHistoryService
    , private readonly modalSvc: NgbModal
    , private readonly modalSubscriberSvc: ModalSubscriberService
    , private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService
    , private readonly router: Router
    , private readonly authSvc: AuthService) { }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.createUser = history.state.createUser != null ? history.state.createUser : false;
    this.editUser = history.state.editUser != null ? history.state.editUser : false;

    if (this.createUser) {
      this.toast.showSuccess('User created!');
      this.createUser = false;
    }

    if (this.editUser) {
      this.toast.showSuccess('User updated!');
      this.editUser = false;
    }
  }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let viewUserOpdId = parseInt(environment.view_user_op_id);
        if(! this.userClaim.operations.some(e => e === viewUserOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
        this.subscribeToUserRoleStatusAsRef();
        this.subscribeToUserStatusAsRef();
        this.subscribeToModal();
        this.initUserMgmtGrid();
        this.filterUsers();
        this.checkAllowedOperation();
      });
  }

  private initUserMgmtGrid() {

    this.userMgmtCols = [
      <ColDef>{ headerName: 'User Name', valueGetter: function (params) { return params.data.name }, cellRenderer: UsernameColComponent, sortable: true },
      <ColDef>{ headerName: 'Email Address', field: 'email', sortable: true, autoHeight: true },
      <ColDef>{ headerName: 'BU', field: 'tenant', sortable: true },
      <ColDef>{ headerName: 'Application', field: 'application', sortable: true, autoHeight: true },
      <ColDef>{ headerName: 'Roles', field: 'roles', cellRenderer: RolesColComponent, sortable: false, autoHeight: true },
      <ColDef>{ headerName: 'Role Status', field: 'roles', cellRenderer: RoleStatusColComponent, sortable: false },
      <ColDef>{ headerName: 'Create Date', field: 'roles', cellRenderer: CreateDateColComponent, sortable: false },
      <ColDef>{ headerName: 'Actions', cellRenderer: ActionsColComponent, sortable: false }
    ]

    this.userMgmtGridOptions = <GridOptions>{
      columnDefs: this.userMgmtCols,
      rowData: this.usersData,
      pagination: false,
      paginationPageSize: 20,
      suppressPaginationPanel: true,
      defaultColDef: {
        minWidth: 100,
        suppressMovable: true,
        comparator: (valueA, valueB) => {
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        }
      }
    };

  }

  private subscribeToModal() {
    this.modalSubscriberSvc.currentState.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: res => {
        if (res == null) {
          return;
        }
        if (res["modalName"] == 'personalInfo') {
          this.openPersonalInfoModal(this.personalInfoModal, res);
          this.modalSubscriberSvc.changeState(null);
        } else if (res["modalName"] == 'blockUnblock') {
          this.openBlockUnblockModal(this.blockUnblockModal, res);
          this.modalSubscriberSvc.changeState(null);
        } else if (res["modalName"] == 'editHistory') {
          this.openEditHistoryModal(this.editHistoryModal, res);
          this.modalSubscriberSvc.changeState(null);
        }
      }
    });
  }

  private subscribeToTenantAsRef() {

    let userTypeClaim : string = this.userClaim.user.userType;
    let userTenantsClaim : number[] = this.userClaim.tenants;

    this.refTenantSvc.get().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let tenantsResponse = res.data as RefTenantDto[];
        //temporary fixed to filter user must belong in the same tenant in the tenant claim of login BU manager
        if(userTypeClaim == userType.buAdmin){
          tenantsResponse.push({ tenantId: 0, tenantName: 'All business units', isActive: false }); // default value
            this.tenants = tenantsResponse.map(m => {
              return {
                label: m.tenantName,
                value: m.tenantId
              }
            });
            this.buDefaultPlaceHolder = "All business units"
            this.defTenantId = 0;
        } else if(userTypeClaim == userType.buManager){
          const filtered = tenantsResponse.filter(p => userTenantsClaim.includes(p.tenantId));
          this.tenants = filtered.map(p =>
            {
              return {
                label: p.tenantName,
                value: p.tenantId
              }
            });
          this.buDefaultPlaceHolder = filtered[0].tenantName;
          this.defTenantId = filtered[0].tenantId;
          this.filterRequest.tenantId = this.defTenantId;
        }
      },
      complete : () =>
      {
        this.filterUsers();
      }
    });
  }

  private subscribeToApplicationAsRef() {
    this.refApplicationSvc.get().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let apps = res.data as RefApplicationDto[];
        apps.push({ appId: 0, appName: 'All applications' }); // default value

        this.applications = apps.map(m => {
          return {
            label: m.appName,
            value: m.appId
          }
        })
      }
    });
  }

  private subscribeToUserRoleStatusAsRef() {
    this.refUserRoleStatusSvc.get().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let roleStatus = res.data as RefUserRoleStatusDto[];
        roleStatus.push({ userRoleStatusId: 0, userRoleStatus: 'All role status' }); // default value
        this.roleStatus = roleStatus.map(m => {
          return {
            label: m.userRoleStatus,
            value: m.userRoleStatusId
          }
        })
      }
    })
  }

  private subscribeToUserStatusAsRef() {
    this.refUserStatusSvc.get().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let response = res.data as RefUserStatusDto[];
        response.push({ userStatusId: 0, userStatus: 'All user status' }); // default value
        this.userStatus = response.map(m => {
          return {
            label: m.userStatus,
            value: m.userStatusId
          }
        })
      }
    })
  }

  setRolesRef() {

    if (this.filterRequest.tenantId > 0 && this.filterRequest.appId > 0) {
      var query = <GetRefAppTenantRoleQry><unknown>{
        appId: this.filterRequest.appId,
        tenantId: this.filterRequest.tenantId,
      }
      this.refRoleSvc.getAppTenantRole(query).subscribe({
        next: (res) => {
          let rolesData = res.data as RefAppTenantRoleListDto[];
          rolesData.push({ roleId: 0, roleName: 'All Roles' }); // default value
          this.roles = rolesData.map(m => {
            return {
              label: m.roleName,
              value: m.roleId
            }
          })
        }
      });
    } else {
      this.roles = [];
    }

    this.filterUsers();
  }

  clearFilters() {
    this.filterRequest = <GetUserListQry>{
      searchKey: "",
      tenantId: this.defTenantId,
      appId: 0,
      roleId: [],
      roleStatus: 0,
      userStatus: 0,

      pageNumber: 0,
      rowCount: this.fixedRowCount
    };

    this.filterUsers();
  }

  filterUsers() {
    if(this.buDefaultPlaceHolder === undefined || this.defTenantId === undefined){
      return;
    }
    this.filterRequest.pageNumber = 1;
    this.currentPageNum = 1;

    this.userSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.users = (res.data as GetAppUserAccessQryRes);
          this.usersData = (res.data as GetAppUserAccessQryRes).appUserAccessList;
        }else{
          this.users = {
            appUserAccessList: [],
            totalCount: 0
          };
          this.usersData = [];
        }
      }
      , error: () => {
        this.currentRowCount = this.users.totalCount;
        this.currentTotalRowCount = this.users.totalCount;

        this.currentPageNum = 1;
        this.startRow = 1;
        this.endRow = this.users.totalCount;
        this.previousRow = this.users.totalCount;
      }
      , complete: () => {
        this.currentRowCount = this.users.totalCount;
        this.currentTotalRowCount = this.users.totalCount;

        this.currentPageNum = 1;
        this.startRow = 1;
        this.endRow = this.users.totalCount;
        this.previousRow = this.users.totalCount;
      }
    });

  }

  // ag-grid config
  onGridRead(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.colApi = e.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridColFitToSizeSvc.gridApi = e.api;
  }

  // modal configs
  // openPersonalInfoModal(content: TemplateRef<NgbModal>, model: UserQryDto) {
  openPersonalInfoModal(content: ElementRef, user: any) {
    this.ldapSvc.getLdapUser(user["userName"].toString()).subscribe({
      next: (res) => {
        this.ldapUser = res
        this.modalModel = {
          name: user["name"],
          userName: user["userName"],
          email: user["email"],
          tenant: user["tenant"],
          application: user["application"],

          ldapUser: this.ldapUser
        }
        this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
      }
    });
  }

  // openBlockUnblockModal(content: TemplateRef<NgbModal>, model: UserQryDto) {
  openBlockUnblockModal(content: ElementRef, user: any) {
    this.modalModel = {
      userId: user["userId"],
      userStatus: user["userStatus"],
      email: user["email"],

    }
    this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openEditHistoryModal(content: ElementRef, user: any) {

    var query = <GetUserHistoryByIdQry>{
      userId: user["userId"],
      appId: user["appId"],
      tenantId: user["tenantId"]
    }

    this.userHistorySvc.get(query).subscribe({
      next: (res) => {

        this.modalModel = {
          name: user["name"],
          email: user["email"]
        }

        this.editHistoryData = res.data != null ? (res.data as UserHistoryByIdDto).userHistoryDetails : [];

        this.editHistoryCols = [
          <ColDef>{ headerName: 'Edit Date/Time', field: 'editDateTime', valueFormatter: function (params) { return moment(params.value).format('MMM DD YYYY hh:mm A') } },
          <ColDef>{ headerName: 'Editor', field: 'editor' },
          <ColDef>{ headerName: 'BU', field: 'tenant' },
          <ColDef>{ headerName: 'Application', field: 'application' },
          <ColDef>{ headerName: 'Action/Details', field: 'actionDetails', autoHeight: true },
          <ColDef>{ headerName: 'Assigned Access Duration', field: 'accessDuration', sortable: false }
        ]

        this.editHistoryGridOptions = <GridOptions>{
          columnDefs: this.editHistoryCols,
          rowData: this.editHistoryData,
          pagination: true,
          defaultColDef: {
            suppressMovable: true,
            sortable: true
          }
        };

        this.modalSvc.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
      }
    });

  }

  // blockUnblockUser(model: UserQryDto) {
  blockUnblockUser(userId: number, userStatus: number) {

    let command = <UpdateUserStatusCmd><unknown>{
      userId: userId,
      userStatus: 0,
      editor: this.userClaim.user.userName
    };

    if (userStatus == 1) {
      command.userStatus = 2;
      this.userSvc.updateUserStatus(command).subscribe({
        next: (res) => {
          this.toast.showSuccess('User blocked!');
          this.filterUsers();
        }
      });
    } else {
      command.userStatus = 1;
      this.userSvc.updateUserStatus(command).subscribe({
        next: (res) => {
          this.toast.showSuccess('User unblocked!');
          this.filterUsers();
        }
      });
    }
  }

  previous() {

    if (this.currentPageNum == 1) {
      return;
    }

    this.currentPageNum = this.currentPageNum - 1;
    this.filterRequest.pageNumber = this.currentPageNum;

    this.userSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        this.users = (res.data as GetAppUserAccessQryRes);
        this.usersData = (res.data as GetAppUserAccessQryRes).appUserAccessList;
      }
      , error: () => {
        this.currentRowCount = this.users.totalCount;
        this.currentTotalRowCount = this.users.totalCount;

        this.currentPageNum = 1;
        this.startRow = 1;
        this.endRow = this.users.totalCount;
        this.previousRow = this.users.totalCount;
      }
      , complete: () => {
        this.endRow = this.endRow - this.currentRowCount;
        this.startRow = this.startRow - this.previousRow;

        this.currentTotalRowCount = this.currentTotalRowCount - this.currentRowCount;
        this.currentRowCount = this.users.totalCount;
      }
    });

  }
  next() {
    if (this.currentRowCount < this.fixedRowCount) {
      return;
    }

    this.currentPageNum = this.currentPageNum + 1;
    this.filterRequest.pageNumber = this.currentPageNum;

    this.userSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        this.users = (res.data as GetAppUserAccessQryRes);
        this.usersData = (res.data as GetAppUserAccessQryRes).appUserAccessList;
      }
      , error: () => {
        this.currentRowCount = this.users.totalCount;
        this.currentTotalRowCount = this.users.totalCount;

        this.currentPageNum = 1;
        this.startRow = 1;
        this.endRow = this.users.totalCount;
        this.previousRow = this.users.totalCount;
      }
      , complete: () => {
        this.startRow = this.startRow + this.currentRowCount;
        this.previousRow = this.currentRowCount;
        this.currentTotalRowCount = this.currentTotalRowCount + this.users.totalCount;
        this.currentRowCount = this.users.totalCount;
        this.endRow = this.endRow + this.users.totalCount;
      }
    });

  }

  checkAllowedOperation()
  {
    let createUserOpsId = parseInt(environment.add_user_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledCreate = this.userClaim.operations.some(e => e === createUserOpsId);
    }
  }

}
