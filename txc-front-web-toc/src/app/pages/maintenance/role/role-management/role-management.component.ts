import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { ColumnApi, GridApi, ColDef, GridOptions, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { RoleActionColComponent } from './role-management-ag-grid/role-action-col/role-action-col.component';
// services
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { RoleService } from 'src/app/core/service/maintenance/role/role.service';
// DTOs/models
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { GetRoleListQryRes, RoleQryDto } from 'src/app/core/models/maintenance/dto/role/role-query-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
// queries/commands
import { GetRoleListQry } from 'src/app/core/models/maintenance/queries/role/get-role-list-query';
import { retry } from 'rxjs';
import { RoleMgmtResourceColComponent } from './role-management-ag-grid/role-mgmt-resource-col/role-mgmt-resource-col.component';
import { RoleMgmtOperationDetailsColComponent } from './role-management-ag-grid/role-mgmt-operation-details-col/role-mgmt-operation-details-col.component';
import { CheckUserPermissionService } from 'src/app/core/service/security/permission/check-user-permission.service';
//environment
import { environment } from 'src/environments/environment';
import { AgGridColFitToSizeService } from 'src/app/core/service/tools/ag-grid-col-fit-to-size.service';
import { userType } from 'src/app/core/models/constants/user-type';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit, AfterViewInit {

  pageTitle: BreadcrumbItem[] = [];

  //custom pagination
  fixedRowCount : number = 20;
  currentPageNum : number = 0;
  currentTotalRowCount : number = 0;
  currentRowCount : number = 0;
  startRow : number = 0;
  endRow : number = 0;
  previousRow : number = 0;
  // dropdown
  tenants!: RefTenantDto[];
  allTabSelected: boolean = true;

  applications!: Select2Data;
  roles!: Select2Data;

  // request
  filterRequest = <GetRoleListQry><unknown>{
    searchKey: "",
    tenantId: 0,
    appId: 0,
    roleId: 0,

    pageNumber: 0,
    rowCount: this.fixedRowCount
  }

  // response
  rolesList = <GetRoleListQryRes><unknown>{
    roles: [] as RoleQryDto[],
    totalCount: 0
  }

  // toast
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  createRole: boolean = false;
  editRole: boolean = false;

  // AgGrid
  gridApi: GridApi;
  colApi: ColumnApi;

  roleMgmtCols: ColDef[] = [];
  rolesData: RoleQryDto[] = [];
  roleMgmtGridOptions: GridOptions;

  enabledCreate : boolean;
  userClaim = new UserAuthClaim();

  constructor(private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly roleSvc: RoleService
    , private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService
    , private readonly authSvc: AuthService
    , private router: Router) { }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let viewRoleOpdId = parseInt(environment.view_role_op_id);
        if(! this.userClaim.operations.some(e => e === viewRoleOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
        this.filterRoles();
        this.initRoleMgmtGrid();
        this.checkAllowedOperation();
      });
  }

  ngAfterViewInit(): void {

    this.createRole = history.state.createRole != null ? history.state.createRole : false;
    this.editRole = history.state.editRole != null ? history.state.editRole : false;

    if (this.createRole) {
      this.toast.showSuccess('Role created!');
      this.createRole = false;
    }

    if (this.editRole) {
      this.toast.showSuccess('Role updated!');
      this.editRole = false;
    }
  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().subscribe({
      next: (res) => {
        this.tenants = (res.data as RefTenantDto[]);
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

  private initRoleMgmtGrid() {

    this.roleMgmtCols = [
      <ColDef>{ headerName: 'Application', field: 'application', sortable: true },
      <ColDef>{ headerName: 'Role Name', field: 'roleName', sortable: true },
      <ColDef>{ headerName: 'Resource', field: 'resourceItems', cellRenderer: RoleMgmtResourceColComponent, sortable: true },
      <ColDef>{ headerName: 'Operation Details', field: 'resourceItems', cellRenderer: RoleMgmtOperationDetailsColComponent, sortable: true,suppressSizeToFit: false },
      <ColDef>{
                headerName: 'Status', field: 'status',
                valueFormatter: params => params.value ? 'Enabled' : 'Disabled',
                sortable: true
              },
      <ColDef>{ headerName: 'Actions', cellRenderer: RoleActionColComponent, sortable: false }
    ]

    this.roleMgmtGridOptions = <GridOptions>{
      columnDefs: this.roleMgmtCols,
      rowData: this.rolesData,
      pagination: false,
      paginationPageSize: 20,
      suppressPaginationPanel: true,
      defaultColDef: {
        suppressMovable: true,
        autoHeight: true,

        comparator: (valueA, valueB) => {
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        }
      }
    };

  }

  // ag-grid config
  onGridRead(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.colApi = e.columnApi;
    this.gridApi.sizeColumnsToFit();

    this.agGridColFitToSizeSvc.gridApi = e.api;
  }

  setTenantTab(tenantId: number) {
    this.filterRequest.tenantId = tenantId;

    var tenant = this.tenants.filter(f => f.tenantId == tenantId);
    if (tenant.length > 0) {
      this.tenants.forEach(fe => fe.isActive = false);

      var item = tenant[0];
      item.isActive = true;

      this.allTabSelected = false;
    }else{
      this.tenants.forEach(fe => fe.isActive = false);
      this.allTabSelected = true;
    }

    this.filterRoles();
  }

  clearFilters(){
    this.tenants.forEach(fe => fe.isActive = false);
    this.allTabSelected = true;

    this.filterRequest = <GetRoleListQry><unknown>{
      searchKey: "",
      tenantId: 0,
      appId: 0,
      roleId: 0,

      pageNumber: 0,
      rowCount: this.fixedRowCount
    }

    this.filterRoles();
  }

  filterRoles(){

    this.filterRequest.pageNumber = 1;
    this.currentPageNum = 1;

    this.roleSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        this.rolesList = (res.data as GetRoleListQryRes);
        //this.rolesData = this.rolesList.roles;
        this.rolesData = this.filterDataByRole(this.rolesList.roles);
      },
      complete: () => {
        this.currentRowCount = this.rolesList.totalCount;
        this.currentTotalRowCount = this.rolesList.totalCount;

        this.currentPageNum = 1;
        this.startRow = 1;
        this.endRow = this.rolesList.totalCount;
        this.previousRow = this.rolesList.totalCount;
      }
    });
  }

  previous(){

    if(this.currentPageNum == 1){
      return;
    }

    this.currentPageNum = this.currentPageNum - 1;
    this.filterRequest.pageNumber = this.currentPageNum;
    this.roleSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        this.rolesList = (res.data as GetRoleListQryRes);
        this.rolesData = this.filterDataByRole(this.rolesList.roles);
      },
      complete: () =>
      {
        this.endRow = this.endRow - this.currentRowCount;
        this.startRow = this.startRow - this.previousRow ;

        this.currentTotalRowCount = this.currentTotalRowCount - this.currentRowCount;
        this.currentRowCount = this.rolesList.totalCount;
      }
    });

  }
  next(){
    //console.log('current',this.currentRowCount);
    if(this.currentRowCount < this.fixedRowCount)
    {
      return;
    }

    this.currentPageNum = this.currentPageNum + 1;
    this.filterRequest.pageNumber = this.currentPageNum;
    this.roleSvc.get(this.filterRequest).subscribe({
      next: (res) => {
        this.rolesList = (res.data as GetRoleListQryRes);
        this.rolesData = this.filterDataByRole(this.rolesList.roles);
      },
      complete: () =>
      {
        this.startRow = this.startRow + this.currentRowCount;
        this.previousRow = this.currentRowCount;
        this.currentTotalRowCount = this.currentTotalRowCount + this.rolesList.totalCount;
        this.currentRowCount = this.rolesList.totalCount;
        this.endRow = this.endRow + this.rolesList.totalCount;
      }
    });

  }

  checkAllowedOperation()
  {
    let createRoleOpsId = parseInt(environment.add_role_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledCreate = this.userClaim.operations.some(e => e === createRoleOpsId);
    }
  }

  private filterDataByRole(roles : RoleQryDto[]) : RoleQryDto[] {
    let currentUserType = this.userClaim.user.userType;
    let newroles : RoleQryDto[] = [];
    if(Array.isArray(roles) && roles.length){
      if(currentUserType == userType.buAdmin){
        newroles = roles.filter(p => !p.isAdmin);
      }else if(currentUserType == userType.superAdmin){
        newroles = roles;
      }
    }
    return newroles;
  }
}
