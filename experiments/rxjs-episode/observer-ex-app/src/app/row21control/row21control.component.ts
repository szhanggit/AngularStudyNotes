import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-row21control',
  templateUrl: './row21control.component.html',
  styleUrls: ['./row21control.component.css']
})
export class Row21controlComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

}
