import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row22control',
  templateUrl: './row22control.component.html',
  styleUrls: ['./row22control.component.css']
})
export class Row22controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
