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
  pageTitle: string;
  private _studentService: StudentService;
  constructor(studentService: StudentService) {
      this._studentService = studentService;
      this.students = [];
      this.pageTitle = '';
   }
  ngOnInit() {
      this.students = this._studentService.getStudents();
      this.pageTitle = this._studentService.getTitle();
  }
}
