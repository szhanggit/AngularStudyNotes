import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row11',
  templateUrl: './row11.component.html',
  styleUrls: ['./row11.component.css']
})
export class Row11Component implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
