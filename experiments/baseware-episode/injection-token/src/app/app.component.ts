import { Component } from '@angular/core';
import { Injectable, Inject, InjectionToken, Injector } from "@angular/core";
import { MY_TOKEN } from './tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: 
	[{
		provide: MY_TOKEN,
		useValue: 'Token Value'
	}]
})


export class AppComponent {
  title = 'injection-token';
  
  /*constructor(@Inject(MY_TOKEN) private myToken: string) 
  {
    console.log("Injected myToken", myToken);
  }*/

  constructor(private injector: Injector) 
  {
    const myToken = this.injector.get(MY_TOKEN);
    console.log("Injected myToken", myToken);
  }

}
