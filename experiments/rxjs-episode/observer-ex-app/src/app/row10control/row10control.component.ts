import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row10control',
  templateUrl: './row10control.component.html',
  styleUrls: ['./row10control.component.css']
})
export class Row10controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
