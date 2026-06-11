import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  today: number = Date.now();

  constructor (private router: Router) { }

  ngOnInit(): void {
    document.body.classList.add('authentication-bg');
  }

  /**
   * redirects to home page
   */
  sendToHome(): void {
    this.router.navigate(["../"]);
  }

}
