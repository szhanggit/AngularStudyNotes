import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { EventType } from '../event-type';
import { Command } from '../layout.model';

@Component({
  selector: 'app-row00',
  templateUrl: './row00.component.html',
  styleUrls: ['./row00.component.css']
})
export class Row00Component implements OnInit {
  content: string = "";
  msg: string = "";
  com: Command;
  constructor(private eventService: EventService) { 
    this.msg = "It comes from row00.";
    this.com = {
      commandId: 5,
      body: "asdf"
    };
  }

  ngOnInit(): void {
  }

  handler(): void{
    this.eventService.broadcast(EventType.ROW00, this.msg);
    this.eventService.broadcast(EventType.ROW00Cmd, this.com);
  }

}
