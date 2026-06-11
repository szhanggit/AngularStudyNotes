import { Component, OnInit } from '@angular/core';
import { StudentRepo } from '../Model/repository.student'
import { Student } from '../Model/student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private stuRepo :StudentRepo) { }

  ngOnInit(): void {
  }

  getAllStudents() {
    this.stuRepo.getStudents().forEach((student) => {
      console.log(`Student name: ${student.firstName}`);
    });
  }

  registerStudent(){
    let stu :Student = { id: 0, firstName: "Zhidan", lastName: "Zhao", grade: 10, gender:true  }; 
    this.stuRepo.saveStudent(stu);
  }

  editStudent(){
    let stu :Student = { id: 1000, firstName: "Zhidan", lastName: "Zhao", grade: 10, gender:true  }; 
    this.stuRepo.saveStudent(stu);
  }

  deleteStudent(){
    this.stuRepo.deleteProduct(5);
  }
}
