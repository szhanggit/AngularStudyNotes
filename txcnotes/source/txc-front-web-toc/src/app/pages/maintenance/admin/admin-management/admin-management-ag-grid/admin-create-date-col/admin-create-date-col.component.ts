import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminUserQryDto } from 'src/app/core/models/maintenance/dto/admin-user/get-admin-user-qry-res';

@Component({
  selector: 'app-admin-create-date-col',
  templateUrl: './admin-create-date-col.component.html',
  styleUrls: ['./admin-create-date-col.component.scss']
})
export class AdminCreateDateColComponent implements ICellRendererAngularComp {

  adminusersData: AdminUserQryDto;

  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }
  agInit(params: ICellRendererParams): void {
    this.adminusersData = params.value as AdminUserQryDto;
  }

}
