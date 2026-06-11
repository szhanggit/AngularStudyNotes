import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { EventType } from '../event-type';

@Component({
  selector: 'app-row21',
  templateUrl: './row21.component.html',
  styleUrls: ['./row21.component.css']
})
export class Row21Component implements OnInit {
  content: string = "";
  ClassesToApply : string = "";
  constructor(private eventService: EventService) { 
    this.eventService.subscribe(EventType.ROW00, (msg) => {
      this.content = msg as string;
      this.ClassesToApply = "badge badge-primary"; 
    });

    this.eventService.subscribe(EventType.ROW01, (msg) => {
      this.content = msg as string;
      this.ClassesToApply = "badge badge-danger"; 
    });
  }

  ngOnInit(): void {
  }

}
