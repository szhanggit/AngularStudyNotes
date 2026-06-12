import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  RegisterStudent(studentForm: NgForm): void {
    var firstName = studentForm.value.firstName;
    var lastName = studentForm.value.lastName;
    var email = studentForm.value.email;

    console.log(firstName);    
  }
}
