import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ModalSubscriberService } from 'src/app/core/service/utilities/modal-subscriber.service';

@Component({
  selector: 'app-admin-action-col',
  templateUrl: './admin-action-col.component.html',
  styleUrls: ['./admin-action-col.component.scss']
})
export class AdminActionColComponent implements ICellRendererAngularComp {

  _params: ICellRendererParams;

  constructor(private readonly modalSubscriberSvc: ModalSubscriberService) { }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this._params = params;
  }

  openPersonalInfoModal() {
    let param = {
      state: true,
      name: this._params.data.name,
      userName: this._params.data.userName,
      email: this._params.data.email,
      tenant: this._params.data.tenant,
      application: this._params.data.application,
      modalName: 'personalInfo'
    }

    this.modalSubscriberSvc.changeState(param);

  }

  openBlockUnblockModal() {
    let param = {
      state: true,
      userId: this._params.data.userId,
      userStatus: this._params.data.userStatus,
      email: this._params.data.email,
      modalName: 'blockUnblock'
    }

    this.modalSubscriberSvc.changeState(param);

  }

  openEditHistoryModal() {
    let param = {
      state: true,
      userId: this._params.data.userId,
      appId: this._params.data.appId,
      tenantId: this._params.data.tenantId,
      name: this._params.data.name,
      email: this._params.data.email,
      modalName: 'editHistory'
    }
    console.log('modal',this._params);
    this.modalSubscriberSvc.changeState(param);
  }

}
