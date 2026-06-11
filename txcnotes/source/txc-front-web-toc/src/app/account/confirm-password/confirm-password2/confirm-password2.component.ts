import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-password2',
  templateUrl: './confirm-password2.component.html',
  styleUrls: ['./confirm-password2.component.scss']
})
export class ConfirmPassword2Component implements OnInit {

  today: number = Date.now();

  constructor () { }

  ngOnInit(): void {
  }

}
