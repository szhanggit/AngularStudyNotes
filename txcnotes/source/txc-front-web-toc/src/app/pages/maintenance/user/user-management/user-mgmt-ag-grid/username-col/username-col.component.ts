import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-username-col',
  templateUrl: './username-col.component.html',
  styleUrls: ['./username-col.component.scss']
})
export class UsernameColComponent implements ICellRendererAngularComp {

  _params: ICellRendererParams;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this._params = params;
  }

}
