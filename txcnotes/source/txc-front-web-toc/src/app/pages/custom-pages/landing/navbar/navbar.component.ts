import { Component, OnInit } from '@angular/core';
// types
import { User } from 'src/app/core/models/auth.models';
// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  mobileMenuOpen: boolean = false;
  loggedInUser: User | null = null;

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();
  }

}
