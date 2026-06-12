import { Component, Input, OnInit } from '@angular/core';

// type
import { SocialEvent } from '../shared/social.model';


@Component({
  selector: 'app-social-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() socialEvents: SocialEvent[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
