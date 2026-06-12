import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  onClick(): void {
    console.log('Button is Clicked');
  }

  ColumnSpan: number = 2;
  FirstName: string = 'Anurag';
  LastName: string = 'Mohanty';
  Branch: string = 'CSE';
  Mobile: number = 9876543210
  Gender: string = 'Male';
  Age: number = 20;
  
  ShowDetails: boolean = false;
  ToggleDetails(): void {
      this.ShowDetails = !this.ShowDetails;
  }
}
