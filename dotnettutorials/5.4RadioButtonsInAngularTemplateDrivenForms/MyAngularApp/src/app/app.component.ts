import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gender = 'female';
  RegisterStudent(studentForm: NgForm): void {       
    var gender = studentForm.value.gender;
    console.log(studentForm.value);
  }
}
