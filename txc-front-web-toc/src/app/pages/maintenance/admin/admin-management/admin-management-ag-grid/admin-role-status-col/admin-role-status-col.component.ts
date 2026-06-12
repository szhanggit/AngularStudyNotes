import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminUserQryDto } from 'src/app/core/models/maintenance/dto/admin-user/get-admin-user-qry-res';

@Component({
  selector: 'app-admin-role-status-col',
  templateUrl: './admin-role-status-col.component.html',
  styleUrls: ['./admin-role-status-col.component.scss']
})
export class AdminRoleStatusColComponent implements ICellRendererAngularComp {

  adminusersData: AdminUserQryDto;
  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.adminusersData = params.value as AdminUserQryDto;
  }

}
