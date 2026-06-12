import { Component, OnInit } from '@angular/core';

// type
import { CardDropdownOption } from '../card-title/card-title.model';
import { Message } from './message.model';

@Component({
  selector: 'app-widget-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  dropdownOptions: CardDropdownOption[] = [{ label: 'Settings' }, { label: 'Action' }];
  constructor () { }

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   * fetches message list
   */
  _fetchData(): void {
    this.messages = [
      {
        id: 1,
        avatar: 'assets/images/users/avatar-2.jpg',
        sender: 'Tomaslau',
        text: 'I\'ve finished it! See you so...'
      },
      {
        id: 2,
        avatar: 'assets/images/users/avatar-3.jpg',
        sender: 'Stillnotdavid',
        text: 'This theme is awesome!'
      },
      {
        id: 3,
        avatar: 'assets/images/users/avatar-4.jpg',
        sender: 'Kurafire',
        text: 'Hyper is awesome theme!'
      },
      {
        id: 4,
        avatar: 'assets/images/users/avatar-5.jpg',
        sender: 'Shahedk',
        text: 'This theme is awesome'
      },
      {
        id: 5,
        avatar: 'assets/images/users/avatar-6.jpg',
        sender: 'Adhamdannaway',
        text: 'Ubold theme is awesome'
      }
    ];
  }

}
