import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';

import { TenantModel } from 'src/app/core/models/tenant/tenant-model';
import { AuthService } from 'src/app/core/service/security/auth.service';

import { TenantListService } from 'src/app/core/service/tenant/tenant/tenant-list.service';
import { ConfirmationService } from 'src/app/core/service/tools/confirmation.service';
import { environment } from 'src/environments/environment';
import { TlActionsColumnComponent } from './tl-actions-column/tl-actions-column.component';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set filterKeyword(value: string) {
    if (!this.gridApi) return;
    this.gridApi.setQuickFilter(value);
  }

  tenantList: TenantModel[] = [];
  tenantListColDefs: ColDef[] = [];
  tenantListGridOptions: GridOptions = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  userClaim = new UserAuthClaim();

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  constructor(
    private tenantListSvc: TenantListService,
    private readonly confirmationSvc: ConfirmationService,
    private readonly router: Router,
    private readonly authSvc: AuthService) {
  }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let viewTenantOpdId = parseInt(environment.view_tenant_op_id);
        if(! this.userClaim.operations.some(e => e === viewTenantOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
      });
    this.tenantListSvc.getList((res: any) => {
      this.tenantList = res;
      this._initTenantListGrid();
    });
  }

  ngOnDestroy(): void {
    this.gridApi = undefined;
  }

  ngAfterViewInit(): void {
    this._subscribeToTenantList();
  }

  private _subscribeToTenantList() {
    this.tenantListSvc.subscribeToList()
      .subscribe({
        next: (tenantList: TenantModel[]) => {
          if (this.gridApi) {
            this.gridApi.setRowData(tenantList);
          }
        }
      });
  }

  onGridReady(e: GridReadyEvent): void {
    this.gridApi = e.api;
    this.columnApi = e.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.columnApi.autoSizeAllColumns();
  }

  onFirstDataRendered(): void {
    if (!this.gridApi) return;
    this.gridApi.sizeColumnsToFit();
  }

  private _initTenantListGrid() {
    this.tenantListColDefs = [
      <ColDef>{ headerName: 'Tenant', field: 'name', sortable: true, sort: 'asc' },
      <ColDef>{ headerName: 'Country', field: 'country', sortable: true },
      <ColDef>{
        headerName: 'Company Tax Type', field: 'companyTaxType',
        valueFormatter: params => params.value ? 'Before Tax' : 'After Tax',
        sortable: false
      },
      <ColDef>{
        headerName: 'Company Tax Rate', field: 'companyTaxRate',
        valueFormatter: params => params.value ? `${params.value}%` : '',
        sortable: false
      },
      <ColDef>{
        headerName: 'Actions', field: 'tenantBasicInfoId', sortable: false, cellRenderer: TlActionsColumnComponent
      }
    ];

    this.tenantListGridOptions = <GridOptions>{
      columnDefs: this.tenantListColDefs,
      rowData: this.tenantList,
      suppressNavigable: true,
      cellClass: 'no-border',
      pagination: true,
      paginationAutoPageSize: true,
      defaultColDef: {
        suppressMovable: true,
        comparator: (valueA, valueB) => {
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        }
      }
    };

    this.gridApi.sizeColumnsToFit();
  }

}
