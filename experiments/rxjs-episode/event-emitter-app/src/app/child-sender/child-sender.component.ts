import { Component, OnInit } from '@angular/core';
import { MessageSubscriberService, IMessage } from '../service/message-subscriber.service';

@Component({
  selector: 'app-child-sender',
  templateUrl: './child-sender.component.html',
  styleUrls: ['./child-sender.component.css']
})
export class ChildSenderComponent implements OnInit {

  constructor(private readonly messageSubscriberSvc: MessageSubscriberService) { }

  ngOnInit(): void {
  }

  sendMessage(){
    let param :IMessage = {
      state: true,
      name: "Steven",
      userName: "stzhang",
      email: "steven.zhang-extern@renault.com",
      tenant: "IN",
      application: "TrainingApp",
      modalName: 'personalInfo'
    }
    this.messageSubscriberSvc.changeState(param);
  }
}
