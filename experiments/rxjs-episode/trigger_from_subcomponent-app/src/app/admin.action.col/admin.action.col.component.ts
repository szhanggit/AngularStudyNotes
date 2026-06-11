import { Component, OnInit } from '@angular/core';
import { ModalSubscriberService } from '../modal.subscriber.service';

@Component({
  selector: 'app-admin-action-col',
  templateUrl: './admin.action.col.component.html',
  styleUrls: ['./admin.action.col.component.css']
})
export class AdminActionColComponent implements OnInit {

  constructor(private readonly modalSubscriberSvc: ModalSubscriberService) { }

  ngOnInit(): void {
  }

  openPersonalInfoModal() {
    let param = {
      state: true,
      name: "name1",
      userName: "userName1",
      email: "email1",
      tenant: "tenant1",
      application: "application1",
      modalName: 'personalInfo'
    }

    this.modalSubscriberSvc.changeState(param);

  }

  openBlockUnblockModal() {
    let param = {
      state: true,
      userId: "userId2",
      userStatus: "userStatus2",
      email: "email2",
      modalName: 'blockUnblock'
    }

    this.modalSubscriberSvc.changeState(param);

  }

  openEditHistoryModal() {
    let param = {
      state: true,
      userId: "userId3",
      appId: "appId3",
      tenantId: "tenantId3",
      name: "name3",
      email: "email3",
      modalName: 'editHistory'
    }
    this.modalSubscriberSvc.changeState(param);
  }

}
