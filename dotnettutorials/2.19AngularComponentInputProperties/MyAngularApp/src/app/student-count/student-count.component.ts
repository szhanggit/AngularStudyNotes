import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-count',
  templateUrl: './student-count.component.html',
  styleUrls: ['./student-count.component.css']
})
export class StudentCountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  all: number = 0;

  @Input()
  male: number = 0;

  @Input()
  female: number = 0;

}
