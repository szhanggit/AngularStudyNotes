import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>
  <h1>{{pageHeader}}</h1>                  
  <app-student></app-student>
  </div>`
})
export class AppComponent {
  pageHeader: string = 'Student Details';
}
