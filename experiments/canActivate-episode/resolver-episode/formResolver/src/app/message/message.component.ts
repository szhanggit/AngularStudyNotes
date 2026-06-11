import { Component, OnInit } from '@angular/core';
import { filter } from "rxjs/operators";
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { Router, NavigationEnd, NavigationCancel } from "@angular/router";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  lastMessage: Message;
  constructor(messageService: MessageService, router: Router) { 
    messageService.messages.subscribe(m => this.lastMessage = m);
    router.events
        .pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel))
        .subscribe(e => { this.lastMessage = null; });
  }

  ngOnInit(): void {
  }

}
