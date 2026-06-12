import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component implements OnInit {

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
