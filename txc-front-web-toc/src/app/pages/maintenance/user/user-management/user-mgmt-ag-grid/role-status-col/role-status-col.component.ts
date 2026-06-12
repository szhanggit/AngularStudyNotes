import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UserQryRoleAccessQryDto } from 'src/app/core/models/maintenance/dto/user/user-query-dto';

@Component({
  selector: 'app-role-status-col',
  templateUrl: './role-status-col.component.html',
  styleUrls: ['./role-status-col.component.scss']
})
export class RoleStatusColComponent implements ICellRendererAngularComp {

  roles: UserQryRoleAccessQryDto[];

  constructor() { }
  
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.roles = params.value as UserQryRoleAccessQryDto[];
  }

  ngOnInit(): void {
  }

}
