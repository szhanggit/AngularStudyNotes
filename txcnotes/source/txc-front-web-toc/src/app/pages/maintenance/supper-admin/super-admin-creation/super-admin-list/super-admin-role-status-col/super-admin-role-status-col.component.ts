import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminUserQryDto } from 'src/app/core/models/maintenance/dto/admin-user/get-admin-user-qry-res';
import { SuperAdminListQryDto } from 'src/app/core/models/super-admin-crud/response/get-all-super-admin-list-qry-res.model';

@Component({
  selector: 'app-super-admin-role-status-col',
  templateUrl: './super-admin-role-status-col.component.html',
  styleUrls: ['./super-admin-role-status-col.component.scss']
})
export class SuperAdminRoleStatusColComponent implements ICellRendererAngularComp {

  superadminadminusersData: SuperAdminListQryDto;
  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.superadminadminusersData = params.value as SuperAdminListQryDto;
  }

}
