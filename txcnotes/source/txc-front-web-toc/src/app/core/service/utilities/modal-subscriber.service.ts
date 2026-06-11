import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalSubscriberService {

  private state = new BehaviorSubject(null);
  currentState = this.state.asObservable();

  constructor() { }

  changeState(param: object){
    this.state.next(param);
  }

}

