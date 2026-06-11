import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-username-col',
  templateUrl: './admin-username-col.component.html',
  styleUrls: ['./admin-username-col.component.scss']
})
export class AdminUsernameColComponent implements ICellRendererAngularComp {

  _params: ICellRendererParams;

  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this._params = params;
  }

}
