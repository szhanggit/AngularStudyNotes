import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  BranchId = "2";
  RegisterStudent(studentForm: NgForm): void {   
    console.log(studentForm.value);
  }

  Branches: any[] = [
    { id: 1, name: 'CSE' },
    { id: 2, name: 'ETC' },
    { id: 3, name: 'Mechanical' },
    { id: 4, name: 'Electrical' }
  ];
}
