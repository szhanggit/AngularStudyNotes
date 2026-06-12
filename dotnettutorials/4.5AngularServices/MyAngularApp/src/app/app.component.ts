import { Component } from '@angular/core';
import {StudentService} from './student.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[StudentService]
})
export class AppComponent {
  students: any[];

  constructor(private _studentService: StudentService) {
      this.students = [];
  }

  ngOnInit() {
    this.students = this._studentService.getStudents();
  }
}
