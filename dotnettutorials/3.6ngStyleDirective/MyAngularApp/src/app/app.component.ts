import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  AddButtonCSSStyles() {
    let CssStyles_0 = {        
        'color':'red',
        'font-weight': 'bold',
        'font-size.px': 20
    };
    return CssStyles_0;
  }

  students: any[] = [
    {
        Name: 'Preety', Branch: 'CSE', Gender: 'Female'
    },
    {
        Name: 'Anurag', Branch: 'ETC', Gender: 'Male'
    },
    {
        Name: 'Priyanka', Branch: 'CSE',  Gender: 'Female'
    },
    {
        Name: 'Hina', Branch: 'ETC', Gender: 'Female'
    },
    {
        Name: 'Sambit', Branch: 'CSE', Gender: 'Male'
    }
  ];   
}
