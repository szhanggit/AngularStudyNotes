import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { SuperAdminListQryDto } from 'src/app/core/models/super-admin-crud/response/get-all-super-admin-list-qry-res.model';

@Component({
  selector: 'app-super-admin-create-date-col',
  templateUrl: './super-admin-create-date-col.component.html',
  styleUrls: ['./super-admin-create-date-col.component.scss']
})
export class SuperAdminCreateDateColComponent implements ICellRendererAngularComp {

  superadminusersData: SuperAdminListQryDto;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }
  agInit(params: ICellRendererParams): void {
    this.superadminusersData = params.value as SuperAdminListQryDto;
  }

}
