import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
            <div>
              <h1> {{ 'First Name : '+ FirstName + ', Last Name : ' + LastName }} </h1> 
              <h1> 10 + 5 * 7 - 6 = {{ 10 + 5 * 7 -6 }} </h1> 
              <h1> Bonus = {{Salary * .10 }} </h1>   
              <h1> Last Name : {{ LastName ? LastName : 'Not Available' }} </h1>
              <h1> Full Name : {{ GetFullName() }} </h1>
              <div><img src = {{ImagePath}} />  </div>
            </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  FirstName: string = "Anurag";
  LastName: string = "Mohanty";
  Salary : number = 100000;
  GetFullName() : string {
    return this.FirstName + ' ' + this.LastName;
  }
  ImagePath : string = "https://dotnettutorials.net/wp-content/uploads/2019/09/cropped-dotnettutorials.png";
}
