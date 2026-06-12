import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-super-admin-username-col',
  templateUrl: './super-admin-username-col.component.html',
  styleUrls: ['./super-admin-username-col.component.scss']
})
export class SuperAdminUsernameColComponent implements ICellRendererAngularComp {

  _params: ICellRendererParams;

  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this._params = params;
  }

}
