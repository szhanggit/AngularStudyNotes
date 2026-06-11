import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row00control',
  templateUrl: './row00control.component.html',
  styleUrls: ['./row00control.component.css']
})
export class Row00controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
