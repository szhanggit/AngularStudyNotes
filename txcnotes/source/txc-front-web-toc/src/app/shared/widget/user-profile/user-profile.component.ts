import { Component, OnInit } from '@angular/core';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-widget-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  loggedInUser: User | null = null;

  constructor (
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();
  }

}
