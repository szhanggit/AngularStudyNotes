import { Component, Input, OnInit } from '@angular/core';
// types
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-profile-userbox',
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss']
})
export class UserboxComponent implements OnInit {

  @Input() loggedInUser: User | null = null;

  constructor () { }

  ngOnInit(): void {
  }

}
