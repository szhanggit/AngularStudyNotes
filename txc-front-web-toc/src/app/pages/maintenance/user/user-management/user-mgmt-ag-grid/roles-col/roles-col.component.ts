import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { UserQryRoleAccessQryDto } from 'src/app/core/models/maintenance/dto/user/user-query-dto';
import { ModalSubscriberService } from 'src/app/core/service/utilities/modal-subscriber.service';

@Component({
  selector: 'app-roles-col',
  templateUrl: './roles-col.component.html',
  styleUrls: ['./roles-col.component.scss']
})
export class RolesColComponent implements ICellRendererAngularComp {

  roles: UserQryRoleAccessQryDto[];

  constructor(private readonly modalSubscriberSvc: ModalSubscriberService) { }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.roles = params.value as UserQryRoleAccessQryDto[];
  }
}
