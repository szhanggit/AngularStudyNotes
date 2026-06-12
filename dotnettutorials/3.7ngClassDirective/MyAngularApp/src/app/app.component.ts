import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  AddCSSClasses(flag:string) {
    let Cssclasses_0;
    if(flag == "type1")
    {
      Cssclasses_0 = {
        'one' : true,
        'two' : true
      }
    }
    else
    {
      Cssclasses_0 = {
        'four' : true,
        'five' : true
      }
    }
    return Cssclasses_0;
  }


}
