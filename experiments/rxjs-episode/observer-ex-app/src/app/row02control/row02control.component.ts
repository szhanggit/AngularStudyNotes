import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { EventType } from '../event-type';
import { Command } from '../layout.model';

@Component({
  selector: 'app-row02control',
  templateUrl: './row02control.component.html',
  styleUrls: ['./row02control.component.css']
})
export class Row02controlComponent implements OnInit {
  content: string = "";
  ClassesToApply : string = ""; 
  com: Command = {commandId:0, body:""};
  constructor(private eventService: EventService) { 
    this.eventService.subscribe(EventType.ROW00, (msg) => {
      this.content = msg as string;
      this.ClassesToApply = "badge badge-primary"; 
    });
    this.eventService.subscribe(EventType.ROW00Cmd, (com) => {
      this.com = (com as Command);
      console.log(`CommandId is ${this.com.commandId} and Body is ${this.com.body}`);   
    });
  }

  ngOnInit(): void {
  }

}
