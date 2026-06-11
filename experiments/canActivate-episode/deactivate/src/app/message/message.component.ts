import { Component, OnInit } from '@angular/core';
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { Router, NavigationEnd, NavigationCancel } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  lastMessage: Message | null;

  constructor(messageService: MessageService, router: Router) { 
    this.lastMessage = null;
    console.log("This is the constructor of message.component.ts.");
    messageService.messages.subscribe(m => {this.lastMessage = m; console.log("Here is the contructor of message.component.ts.");});
    router.events
        .pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel))
        .subscribe(e => { this.lastMessage = null; });
  }


}
