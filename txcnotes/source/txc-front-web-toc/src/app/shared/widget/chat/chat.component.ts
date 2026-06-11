import { Component, Input, OnInit, ViewChild } from '@angular/core';

// type
import { ChatMessage } from './chat.model';

// data
import { chatMessages } from './data';

@Component({
  selector: 'app-widget-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() chatMessages: ChatMessage[] = [];
  @Input() listContainerClass: string = '';
  @Input() formContainerClass: string = '';
  newMessage: string = "";
  submitted: boolean = false;

  @ViewChild('chatForm', { static: true }) chatForm!: any;
  constructor () { }

  ngOnInit(): void {
  }



  /**
   * adds new message to chat messages
   */
  sendMessage(): void {
    this.submitted = true;
    if (this.newMessage !== '') {
      var today = new Date();
      const newChatMessage: ChatMessage = {
        id: this.chatMessages.length + 1,
        sender: {
          name: 'Dominic',
          avatar: 'assets/images/users/avatar-5.jpg'
        },
        time: today.getHours() + ":" + today.getMinutes(),
        message: this.newMessage
      }

      this.chatMessages.push(newChatMessage);

      this.chatForm.resetForm();
    }
  }



}
