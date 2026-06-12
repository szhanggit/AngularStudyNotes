import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// type
import { ChatUser } from '../shared/chat.model';

// data
import { USERS } from '../shared/data';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit {

  userList: ChatUser[] = [];
  activeGroup = 1;
  selectedUser!: ChatUser;
  searchUser: string = '';


  //On selecting new user
  @Output() selectUser: EventEmitter<ChatUser> = new EventEmitter();
  constructor () { }

  ngOnInit(): void {
    // Get users for chat
    this._fetchUsers();
  }

  /**
   *  Fetches users for chat
   */
  _fetchUsers(): void {
    this.userList = USERS;
    this.selectedUser = this.userList[0];
  }

  /**
   * changes active user
   * @param user chat user
   */
  activateUser(user: ChatUser): void {
    this.selectedUser = user;
    this.selectUser.emit(this.selectedUser);
  }

  /**
   * filter users by group
   * @param usergroup user group
   */
  filterUsersByGroup(usergroup: string): void {
    this.userList = usergroup === "All" ? [...USERS] : [...USERS].filter((user) => user.groups!.findIndex((e) => e.name === usergroup) >= 0);
  }

  /**
   * search user
   */
  search(): void {
    this.userList = this.searchUser ? [...USERS].filter(u => u.name!.toLowerCase().indexOf(this.searchUser.toLowerCase()) >= 0) : [...USERS];
  }





}
