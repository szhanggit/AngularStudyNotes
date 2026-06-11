import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import moment from 'moment';
import { Select2Data } from 'ng-select2-component';
import { Subject, takeUntil } from 'rxjs';
import { UpdateUserStatusCmd } from 'src/app/core/models/maintenance/command/user/update-user-status-command';
import { AdminUserQryDto, GetAdminUserQryRes } from 'src/app/core/models/maintenance/dto/admin-user/get-admin-user-qry-res';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RefUserRoleStatusDto } from 'src/app/core/models/maintenance/dto/role/ref-user-role-status-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { RefUserStatusDto } from 'src/app/core/models/maintenance/dto/user/ref-user-status-dto';
import { UserHistoryByIdDto, UserHistoryDetailsByIdDto } from 'src/app/core/models/maintenance/dto/user/user-history-by-id-dto';
import { UserQryDto } from 'src/app/core/models/maintenance/dto/user/user-query-dto';
import { GetAdminUserListQry } from 'src/app/core/models/maintenance/queries/admin-user/get-admin-user-list-qry';
import { GetUserHistoryByIdQry } from 'src/app/core/models/maintenance/queries/user/get-user-history-by-id-query';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AdminUserService } from 'src/app/core/service/maintenance/admin-user/admin-user.service';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { RefUserRoleStatusService } from 'src/app/core/service/maintenance/ref-user-role-status.service';
import { RefUserStatusService } from 'src/app/core/service/maintenance/ref-user-status.service';
import { UserHistoryService } from 'src/app/core/service/maintenance/user-history/user-history-service.service';
import { UserService } from 'src/app/core/service/maintenance/user/user.service';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { AgGridColFitToSizeService } from 'src/app/core/service/tools/ag-grid-col-fit-to-size.service';
import { ModalSubscriberService } from 'src/app/core/service/utilities/modal-subscriber.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';
import { AdminActionColComponent } from './admin-management-ag-grid/admin-action-col/admin-action-col.component';
import { AdminCreateDateColComponent } from './admin-management-ag-grid/admin-create-date-col/admin-create-date-col.component';
import { AdminRoleStatusColComponent } from './admin-management-ag-grid/admin-role-status-col/admin-role-status-col.component';
import { AdminUsernameColComponent } from './admin-management-ag-grid/admin-username-col/admin-username-col.component';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  pageTitle: BreadcrumbItem[] = [];
  @ViewChild('personalInfoModal', { static: true }) personalInfoModal: ElementRef;
  @ViewChild('blockUnblockModal', { static: true }) blockUnblockModal: ElementRef;
  @ViewChild('editHistoryModal', { static: true }) editHistoryModal: ElementRef;
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

  // request
  filterRequest = <GetAdminUserListQry><unknown>{
    searchKey: "",
    tenantId: 0,
    appId: 0,
    roleStatus: 0,
    userStatus: 0,

    pageNumber: 0,
    rowCount: this.fixedRowCount
  }

  // dropdown
  tenants!: Select2Data;
  applications!: Select2Data;
  roleStatus!: Select2Data;
  userStatus!: Select2Data;

  // response
  users = <GetAdminUserQryRes><unknown>{
    userQryDto: [] as AdminUserQryDto[],
    totalCount: 0
  }

  // AgGrid
  gridApi: GridApi;
  colApi: ColumnApi;

  adminMgmtCols: ColDef[] = [];
  adminusersData: AdminUserQryDto[] = [];
  adminMgmtGridOptions: GridOptions;

  // modal config
  modalModel!: any;
  ldapUser = new LdaUserModel();

  createAdmin: boolean = false;
  editAdmin: boolean = false;

  editHistoryCols: ColDef[] = [];
  editHistoryData: UserHistoryDetailsByIdDto[] = [];
  editHistoryGridOptions: GridOptions;
  userClaim = new UserAuthClaim();
  enabledCreate : boolean = false;

  constructor(private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refUserRoleStatusSvc: RefUserRoleStatusService
    , private readonly refUserStatusSvc: RefUserStatusService
    , private readonly adminUserSrv: AdminUserService
    , private readonly userSvc: UserService
    , private readonly modalSvc: NgbModal
    , private readonly modalSubscriberSvc: ModalSubscriberService
    , private readonly ldapSvc: LdapUserService
    , private readonly userHistorySvc: UserHistoryService
    , private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService
    , private readonly router: Router
    , private readonly authSvc: AuthService) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.createAdmin = history.state.createAdmin != null ? history.state.createAdmin : false;
    this.editAdmin = history.state.editAdmin != null ? history.state.editAdmin : false;

    if (this.createAdmin) {
      this.toast.showSuccess('Admin created!');
      this.createAdmin = false;
    }

    if (this.editAdmin) {
      this.toast.showSuccess('Admin updated!');
      this.editAdmin = false;
    }
  }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let viewAdminOpdId = parseInt(environment.view_admin_op_id);
        if(! this.userClaim.operations.some(e => e === viewAdminOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
        this.subscribeToUserRoleStatusAsRef();
        this.subscribeToUserStatusAsRef();
        this.search();
        this.subscribeToModal();
        this.initUserMgmtGrid();
        this.checkAllowedOperation();
      });
  }

  private subscribeToModal() {
    this.modalSubscriberSvc.currentState.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
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

  private initUserMgmtGrid() {

    this.adminMgmtCols = [
      <ColDef>{ headerName: 'User Name', valueGetter: function (params) { return params.data.name }, cellRenderer: AdminUsernameColComponent, sortable: true },
      <ColDef>{ headerName: 'Email Address', field: 'email', sortable: true, autoHeight: true },
      <ColDef>{ headerName: 'BU', field: 'tenant', sortable: true },
      <ColDef>{ headerName: 'Application', field: 'application', sortable: true, autoHeight: true },
      <ColDef>{ headerName: 'Role Status', valueGetter: function (params) { return params.data }, cellRenderer: AdminRoleStatusColComponent, sortable: false },
      <ColDef>{ headerName: 'Create Date', valueGetter: function (params) { return params.data }, cellRenderer: AdminCreateDateColComponent, sortable: false,suppressMovable: true },
      <ColDef>{ headerName: 'Actions', cellRenderer: AdminActionColComponent, sortable: false }
    ]

    this.adminMgmtGridOptions = <GridOptions>{
      columnDefs: this.adminMgmtCols,
      rowData: this.adminusersData,
      pagination: false,
      paginationPageSize: 20,
      suppressPaginationPanel: true,
      defaultColDef: {
        minWidth: 100,

        comparator: (valueA, valueB) => {
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        }
      }
    };

  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let tenants = res.data as RefTenantDto[];
        tenants.push({ tenantId: 0, tenantName: 'All business units', isActive: false }); // default value

        this.tenants = tenants.map(m => {
          return {
            label: m.tenantName,
            value: m.tenantId
          }
        })
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

  search() {
    this.adminUserSrv.get(this.filterRequest).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.users = (res.data as GetAdminUserQryRes);
          this.adminusersData = (res.data as GetAdminUserQryRes).adminUsers;
        } else {
          this.users = {
            adminUsers: [],
            totalCount: 0
          };
          this.adminusersData = [];
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

  clearFilters() {
    this.filterRequest = <GetAdminUserListQry><unknown>{
      searchKey: "",
      tenantId: 0,
      appId: 0,
      roleStatus: 0,
      userStatus: 0,

      pageNumber: 0,
      rowCount: this.fixedRowCount
    };

    this.search();
  }

  // ag-grid config
  onGridRead(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.colApi = e.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridColFitToSizeSvc.gridApi = e.api;
  }

  // modal configs
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
      editor: 'rgamboa' // placeholder
    };

    if (userStatus == 1) {
      command.userStatus = 2;
      this.userSvc.updateUserStatus(command).subscribe({
        next: (res) => {
          this.toast.showSuccess('User blocked!');
          this.search();
        }
      });
    } else {
      command.userStatus = 1;
      this.userSvc.updateUserStatus(command).subscribe({
        next: (res) => {
          this.toast.showSuccess('User unblocked!');
          this.search();
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

    this.adminUserSrv.get(this.filterRequest).subscribe({
      next: (res) => {
        this.users = (res.data as GetAdminUserQryRes);
        this.adminusersData = (res.data as GetAdminUserQryRes).adminUsers;
      }
      , error: () => {
        this.endRow = this.endRow - this.currentRowCount;
        this.startRow = this.startRow - this.previousRow;

        this.currentTotalRowCount = this.currentTotalRowCount - this.currentRowCount;
        this.currentRowCount = this.users.totalCount;
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
    //console.log('current',this.currentRowCount);
    if (this.currentRowCount < this.fixedRowCount) {
      return;
    }

    this.currentPageNum = this.currentPageNum + 1;
    this.filterRequest.pageNumber = this.currentPageNum;

    this.adminUserSrv.get(this.filterRequest).subscribe({
      next: (res) => {
        this.users = (res.data as GetAdminUserQryRes);
        this.adminusersData = (res.data as GetAdminUserQryRes).adminUsers;
      }
      , error: () => {
        this.startRow = this.startRow + this.currentRowCount;
        this.previousRow = this.currentRowCount;
        this.currentTotalRowCount = this.currentTotalRowCount + this.users.totalCount;
        this.currentRowCount = this.users.totalCount;
        this.endRow = this.endRow + this.users.totalCount;
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
    let createAdminOpsId = parseInt(environment.add_admin_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledCreate = this.userClaim.operations.some(e => e === createAdminOpsId);
    }
  }
}
