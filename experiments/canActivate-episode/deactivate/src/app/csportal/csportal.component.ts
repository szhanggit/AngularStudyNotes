import { Component, OnInit } from '@angular/core';
import { Message } from '../message/message.model'
import { MessageService } from "../message/message.service";

@Component({
  selector: 'app-csportal',
  templateUrl: './csportal.component.html',
  styleUrls: ['./csportal.component.css']
})
export class CsportalComponent implements OnInit {

  constructor(private messages: MessageService) { }

  ngOnInit(): void {
  }
  
  clickEvent(){
    console.log("clickEvent has been triggered.");
    this.messages.reportMessage(new Message("This is my test."));
  }
}
