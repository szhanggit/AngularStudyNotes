import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row11control',
  templateUrl: './row11control.component.html',
  styleUrls: ['./row11control.component.css']
})
export class Row11controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
