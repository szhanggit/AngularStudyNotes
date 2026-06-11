import { Component } from '@angular/core';
import { MessageService } from "./messages/message.service"
import { Message } from "./messages/message.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'middleoffice2-app';
  constructor(private messages: MessageService) { }

  clickEvent(){
    this.messages.reportMessage(new Message("This is my test."));
  }
}
