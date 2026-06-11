
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GetUserRoleListQuery } from 'src/app/core/models/user-role/request/get-user-role-list-query.model';
import { PaginationModel } from 'src/app/core/models/grid/pagination-model';
import { GridContextModel } from 'src/app/core/models/grid/grid-context-model';
import { ColumnDefModel } from 'src/app/core/models/grid/column-def-model';
import { RoleList } from 'src/app/core/enums/role-list';
import { ListOfUserRolesService } from 'src/app/core/service/user-role/list-of-user-roles.service';
import { SuperAdminService } from 'src/app/core/service/super-admin-crud/super-admin.service';
import { GetAllSuperAdminQry } from 'src/app/core/models/super-admin-crud/request/get-all-super-admin-qry.model';
import { GetAllSuperAdminListQryRes, SuperAdminListQryDto } from 'src/app/core/models/super-admin-crud/response/get-all-super-admin-list-qry-res.model';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SuperAdminUsernameColComponent } from './super-admin-username-col/super-admin-username-col.component';
import { SuperAdminRoleStatusColComponent } from './super-admin-role-status-col/super-admin-role-status-col.component';
import { SuperAdminCreateDateColComponent } from './super-admin-create-date-col/super-admin-create-date-col.component';
import { AgGridColFitToSizeService } from 'src/app/core/service/tools/ag-grid-col-fit-to-size.service';

@Component({
  selector: 'app-super-admin-list',
  templateUrl: './super-admin-list.component.html',
  styleUrls: ['./super-admin-list.component.scss']
})
export class SuperAdminListComponent implements OnInit, AfterViewInit {

  // userRoleListQueryModel = <GetUserRoleListQuery> {
  //   pageNumber: 1,
  //   rowCount: 20,
  //   roleId: RoleList.SuperAdmin,
  //   totalRows: 0
  // }
  // paginationModel: PaginationModel;
  // gridContext: GridContextModel;
  // selectedTenant: any;

  // AgGrid
  gridApi: GridApi;
  colApi: ColumnApi;
  superadminMgmtCols: ColDef[] = [];
  superadminusersData: SuperAdminListQryDto[] = [];
  superadminMgmtGridOptions: GridOptions;

  //custom pagination
  fixedRowCount: number = 20;
  currentPageNum: number = 0;
  currentTotalRowCount: number = 0;
  currentRowCount: number = 0;
  startRow: number = 0;
  endRow: number = 0;
  previousRow: number = 0;
  // request
  filterRequest = <GetAllSuperAdminQry><unknown>{
    searchKey: "",
    roleStatus: 0,
    userStatus: 0,

    pageNumber: 0,
    rowCount: this.fixedRowCount
  }

  // response
  users = <GetAllSuperAdminListQryRes><unknown>{
    userQryDto: [] as SuperAdminListQryDto[],
    totalCount: 0
  }
  constructor(private readonly listOfUserRolesSvc : ListOfUserRolesService
    , private readonly superAdminSvc: SuperAdminService
    , private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService
              ) { }

  ngAfterViewInit(): void {
      this.listOfUserRolesSvc.getUserRoles();
  }

  ngOnInit(): void {


    //this.listOfUserRolesSvc.userRoleListQueryModel.next(this.userRoleListQueryModel);

    // this.gridContext = <GridContextModel>{
    //   enableDefaultAction: true,
    //   enableMultipleSelection: false,
    //   colDefs: this.initializeColumns(),
    //   showPagination: true
    //}
    //this.subscribeToUserListQueryModel();
    this.subscribeToGetListOfUsers();
    this.initUserMgmtGrid();
  }

  // onSetCurrentPage(e:number){
  //   this.userRoleListQueryModel.pageNumber = e;
  //   this.listOfUserRolesSvc.userRoleListQueryModel.next(this.userRoleListQueryModel);
  //   this.listOfUserRolesSvc.getUserRoles();
  // }

  // private subscribeToUserListQueryModel(){
  //   this.listOfUserRolesSvc.userRoleListQueryModel.subscribe({
  //     next: res=> {
  //       this.userRoleListQueryModel = res;
  //       this.paginationModel = res as PaginationModel;
  //     }
  //   })
  // }

  private subscribeToGetListOfUsers()
  {
    this.superAdminSvc.getSuperAdmin(this.filterRequest)
    .subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.users = (res.data as GetAllSuperAdminListQryRes);
          this.superadminusersData = (res.data as GetAllSuperAdminListQryRes).superAdminUsers;
          console.log(res);
        } else {
          this.users = {
            superAdminUsers: [],
            totalCount: 0
          };
          this.superadminusersData = [];
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

  // private initializeColumns(){

  //   return [
  //     <ColumnDefModel>{ name: "User Name", field:"userName" },
  //     <ColumnDefModel>{ name: "Email Address", field:"email" },
  //     <ColumnDefModel>{ name: "Created Date", field:"creationTime" },
  //   ]
  // }
  onGridRead(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.colApi = e.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridColFitToSizeSvc.gridApi = e.api;
  }

  private initUserMgmtGrid() {

    this.superadminMgmtCols = [
      <ColDef>{ headerName: 'User Name', valueGetter: function (params) { return params.data.name }, cellRenderer: SuperAdminUsernameColComponent, sortable: true },
      <ColDef>{ headerName: 'Email Address', field: 'email', sortable: true, autoHeight: true },
      <ColDef>{ headerName: 'Role Status', valueGetter: function (params) { return params.data }, cellRenderer: SuperAdminRoleStatusColComponent, sortable: false },
      <ColDef>{ headerName: 'Create Date', valueGetter: function (params) { return params.data }, cellRenderer: SuperAdminCreateDateColComponent, sortable: false,suppressMovable: true },
    ]

    this.superadminMgmtGridOptions = <GridOptions>{
      columnDefs: this.superadminMgmtCols,
      rowData: this.superadminusersData,
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

}
