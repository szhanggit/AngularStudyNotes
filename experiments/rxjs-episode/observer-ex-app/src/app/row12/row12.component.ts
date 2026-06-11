import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row12',
  templateUrl: './row12.component.html',
  styleUrls: ['./row12.component.css']
})
export class Row12Component implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
