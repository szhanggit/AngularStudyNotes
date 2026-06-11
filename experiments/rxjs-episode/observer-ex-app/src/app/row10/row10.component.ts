import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row10',
  templateUrl: './row10.component.html',
  styleUrls: ['./row10.component.css']
})
export class Row10Component implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
