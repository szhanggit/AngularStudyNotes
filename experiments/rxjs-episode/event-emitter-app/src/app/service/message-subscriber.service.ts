import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageSubscriberService {

  private state = new BehaviorSubject<IMessage | null>(null);
  currentState = this.state.asObservable();

  constructor() { }

  changeState(param: IMessage | null){
    console.log(`param is: ${param}`);
    this.state.next(param);
  }
}

export interface IMessage {
  state: boolean;
  name: string;
  userName: string;
  email: string;
  tenant: string;
  application: string;
  modalName: string;
}