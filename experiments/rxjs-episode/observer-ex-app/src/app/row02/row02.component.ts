import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row02',
  templateUrl: './row02.component.html',
  styleUrls: ['./row02.component.css']
})
export class Row02Component implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
