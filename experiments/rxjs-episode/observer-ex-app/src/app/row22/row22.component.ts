import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row22',
  templateUrl: './row22.component.html',
  styleUrls: ['./row22.component.css']
})
export class Row22Component implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
