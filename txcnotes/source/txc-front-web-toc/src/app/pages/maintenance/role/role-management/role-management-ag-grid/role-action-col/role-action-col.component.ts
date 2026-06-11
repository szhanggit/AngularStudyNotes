import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-role-action-col',
  templateUrl: './role-action-col.component.html',
  styleUrls: ['./role-action-col.component.scss']
})
export class RoleActionColComponent implements ICellRendererAngularComp {

  _params: ICellRendererParams;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  
  agInit(params: ICellRendererParams): void {
    this._params = params;
  }

}
