import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row01control',
  templateUrl: './row01control.component.html',
  styleUrls: ['./row01control.component.css']
})
export class Row01controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
