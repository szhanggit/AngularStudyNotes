import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { EventType } from '../event-type';

@Component({
  selector: 'app-row01',
  templateUrl: './row01.component.html',
  styleUrls: ['./row01.component.css']
})
export class Row01Component implements OnInit {
  content: string = "";
  msg: string = "";
  constructor(private eventService: EventService) { 
    this.msg = "It comes from row01.";
  }

  ngOnInit(): void {
  }

  handler(): void{
    this.eventService.broadcast(EventType.ROW01, this.msg);
  }
}
