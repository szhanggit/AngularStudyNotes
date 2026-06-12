import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAccept = true;
  RegisterStudent(studentForm: NgForm): void {   
    console.log(studentForm.value);
  }
}
