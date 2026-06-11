import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-tl-actions-column',
  templateUrl: './tl-actions-column.component.html',
  styleUrls: ['./tl-actions-column.component.scss']
})
export class TlActionsColumnComponent implements ICellRendererAngularComp {
  id: number;

  refresh(params: ICellRendererParams): boolean {
    this.id = params.getValue();
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.id = params.getValue();
  }

}
