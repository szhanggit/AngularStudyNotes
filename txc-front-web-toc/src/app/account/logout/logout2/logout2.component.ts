import { Component, OnInit } from '@angular/core';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-logout2',
  templateUrl: './logout2.component.html',
  styleUrls: ['./logout2.component.scss']
})
export class Logout2Component implements OnInit {

  constructor (private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.logout();
  }

}
