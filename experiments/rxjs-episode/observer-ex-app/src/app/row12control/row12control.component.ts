import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row12control',
  templateUrl: './row12control.component.html',
  styleUrls: ['./row12control.component.css']
})
export class Row12controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
