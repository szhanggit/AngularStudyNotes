import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-count',
  templateUrl: './student-count.component.html',
  styleUrls: ['./student-count.component.css']
})
export class StudentCountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  all: number = 5;
  male: number = 3;
  female: number = 2;
}
