import { Component, Input, OnInit } from '@angular/core';
// types
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-social-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() loggedInUser: User | null = {};

  constructor () { }

  ngOnInit(): void {
  }

}
