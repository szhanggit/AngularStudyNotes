import { Component } from '@angular/core';
import { Injectable, Inject, InjectionToken } from "@angular/core";
import { BehaviorSubject } from 'rxjs'; 
import { MY_SUBJECT_TOKEN } from './tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'injection-token-behavior-subject';
  constructor(@Inject(MY_SUBJECT_TOKEN) private myToken: BehaviorSubject<string>) 
  {
    myToken.next("from AppComponent");
    console.log("Injected myToken", myToken.getValue());
  }
}
