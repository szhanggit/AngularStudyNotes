import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ResourceQryItemsDto } from 'src/app/core/models/maintenance/dto/role/role-query-dto';

@Component({
  selector: 'app-role-mgmt-resource-col',
  templateUrl: './role-mgmt-resource-col.component.html',
  styleUrls: ['./role-mgmt-resource-col.component.scss']
})
export class RoleMgmtResourceColComponent implements ICellRendererAngularComp {

  resources: ResourceQryItemsDto[];

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.resources = params.value as ResourceQryItemsDto[];
  }
}
