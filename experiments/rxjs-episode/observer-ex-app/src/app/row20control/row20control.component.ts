import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row20control',
  templateUrl: './row20control.component.html',
  styleUrls: ['./row20control.component.css']
})
export class Row20controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
