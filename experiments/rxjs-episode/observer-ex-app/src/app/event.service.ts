import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Command, LayoutColor, LayoutType, LayoutWidth, SideBarTheme, SideBarWidth } from './layout.model';

import { EventType } from './event-type';

type Payload = Command | LayoutType | LayoutWidth | LayoutColor | SideBarTheme | SideBarWidth | boolean | string;

interface Event {
  type: EventType;
  payload: Payload
}

//Defines event callback 
type EventCallback = (payload: Payload) => void;

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private handler = new Subject<Event>();
  constructor() { }

  /**
   * Broadcast the event
   * @param type type of event
   * @param payload payload
   */
  broadcast(type: EventType, payload: Payload): void {
    this.handler.next({ type, payload });
  }

  /**
   * Subscribe to event
   * @param type type of event
   * @param callback call back function
   */
  subscribe(type: EventType, callback: EventCallback): Subscription {
    return this.handler.pipe(
      filter((event) => event.type === type)).pipe(
        map(event => event.payload))
      .subscribe(callback);
  }


}
