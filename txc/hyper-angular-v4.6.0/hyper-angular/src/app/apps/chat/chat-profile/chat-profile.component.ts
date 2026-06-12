import { Component, Input, OnInit } from '@angular/core';

// type
import { ChatUser } from '../shared/chat.model';

@Component({
  selector: 'app-chat-profile',
  templateUrl: './chat-profile.component.html',
  styleUrls: ['./chat-profile.component.scss']
})
export class ChatProfileComponent implements OnInit {

  @Input() user!: ChatUser;
  constructor () { }

  ngOnInit(): void {

  }

}
