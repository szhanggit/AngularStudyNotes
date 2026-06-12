import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>
              Name : <input [(ngModel)]='Name'>
              <br>
              You entered : {{Name}}
            </div>`
})
export class AppComponent {
  Name: string = 'Anurag';
}
