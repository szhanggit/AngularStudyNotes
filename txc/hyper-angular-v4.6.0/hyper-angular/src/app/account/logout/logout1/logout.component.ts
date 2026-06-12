import { Component, OnInit } from '@angular/core';

// auth service
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  today: number = Date.now();

  constructor (private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.logout();
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg');
  }

}
